import React, { useCallback, useEffect, useRef, useState } from 'react';

// Inferno colour map stops (the scale used for thermal false-colour imagery)
const STOPS = [
  [0, 0, 4],
  [50, 10, 94],
  [120, 28, 109],
  [187, 55, 84],
  [237, 105, 37],
  [251, 182, 26],
  [252, 255, 164],
];

function buildLut() {
  const lut = new Uint8ClampedArray(256 * 3);
  const last = STOPS.length - 1;
  for (let i = 0; i < 256; i++) {
    const t = (i / 255) * last;
    const k = Math.min(Math.floor(t), last - 1);
    const f = t - k;
    for (let c = 0; c < 3; c++) {
      lut[i * 3 + c] = STOPS[k][c] + (STOPS[k + 1][c] - STOPS[k][c]) * f;
    }
  }
  return lut;
}

const TICKS = [0, 64, 128, 192, 255];
const SWEEP_MS = 1150;

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Portrait that can be viewed as the original photo or as a false-colour
 * "thermal" render (pixel brightness mapped onto the inferno scale), with a
 * colour bar the image can be read against. On load, the thermal view sweeps
 * away to reveal the photo once.
 */
export default function ThermalPortrait({ src, alt, onError, imgError, initials }) {
  const reduced = useRef(prefersReducedMotion());
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const lumRef = useRef(null);
  const timers = useRef([]);
  const introDone = useRef(false);

  const [status, setStatus] = useState('loading'); // loading | ready | photo-only
  const [mode, setMode] = useState(reduced.current ? 'visible' : 'thermal');
  const [scanning, setScanning] = useState(false);
  const [probe, setProbe] = useState(null);
  const [aspect, setAspect] = useState('3 / 4');

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const switchMode = useCallback((next) => {
    setMode(next);
    if (!reduced.current) {
      setScanning(true);
      later(() => setScanning(false), SWEEP_MS);
    }
  }, []);

  const renderThermal = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !img.naturalWidth) return;

    setAspect(`${img.naturalWidth} / ${img.naturalHeight}`);

    try {
      const scale = Math.min(1, 520 / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const frame = ctx.getImageData(0, 0, w, h);
      const px = frame.data;
      const n = w * h;
      const lum = new Uint8Array(n);
      const hist = new Uint32Array(256);

      for (let i = 0; i < n; i++) {
        const l = Math.round(0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]);
        lum[i] = l;
        hist[l]++;
      }

      // Stretch contrast between the 1st and 99th percentile so the full scale is used
      let lo = 0;
      let hi = 255;
      let acc = 0;
      for (let v = 0; v < 256; v++) {
        acc += hist[v];
        if (acc >= n * 0.01) { lo = v; break; }
      }
      acc = 0;
      for (let v = 255; v >= 0; v--) {
        acc += hist[v];
        if (acc >= n * 0.01) { hi = v; break; }
      }
      const span = Math.max(1, hi - lo);
      const lut = buildLut();

      for (let i = 0; i < n; i++) {
        const v = Math.max(0, Math.min(255, Math.round(((lum[i] - lo) / span) * 255)));
        lum[i] = v;
        px[i * 4] = lut[v * 3];
        px[i * 4 + 1] = lut[v * 3 + 1];
        px[i * 4 + 2] = lut[v * 3 + 2];
      }
      ctx.putImageData(frame, 0, 0);
      lumRef.current = { data: lum, w, h };
      setStatus('ready');
    } catch (err) {
      // Canvas unavailable or image not readable: show the photo only
      setStatus('photo-only');
      setMode('visible');
    }
  }, []);

  // Cached images can finish loading before React attaches onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth) renderThermal();
  }, [src, renderThermal]);

  // One-time intro: thermal view sweeps away to reveal the photo
  useEffect(() => {
    if (status !== 'ready' || introDone.current) return;
    introDone.current = true;
    if (reduced.current) return;
    later(() => switchMode('visible'), 700);
  }, [status, switchMode]);

  const handlePointer = (e) => {
    const lum = lumRef.current;
    if (!lum || mode !== 'thermal') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(0.999, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(0.999, Math.max(0, (e.clientY - rect.top) / rect.height));
    const v = lum.data[Math.floor(y * lum.h) * lum.w + Math.floor(x * lum.w)];
    setProbe({ x, y, v });
  };

  if (imgError) {
    return (
      <div className="portrait">
        <div className="portrait-frame">
          <div className="portrait-placeholder">{initials}</div>
        </div>
      </div>
    );
  }

  const thermalOn = mode === 'thermal' && status !== 'photo-only';
  const showProbe = thermalOn && status === 'ready' && probe && !scanning;

  return (
    <figure className="portrait-figure">
      <div
        className={`portrait ${thermalOn ? 'is-thermal' : ''} ${scanning ? 'is-scanning' : ''}`}
      >
        <div
          className="portrait-frame"
          style={{ aspectRatio: aspect }}
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
          onPointerLeave={() => setProbe(null)}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={renderThermal}
            onError={onError}
            style={{ visibility: status === 'loading' ? 'hidden' : 'visible' }}
          />
          <canvas ref={canvasRef} className="portrait-thermal" aria-hidden="true" />
          <span className="portrait-scan" aria-hidden="true" />

          {showProbe && (
            <>
              <span
                className="portrait-cross"
                style={{ left: `${probe.x * 100}%`, top: `${probe.y * 100}%` }}
                aria-hidden="true"
              />
              <span className="portrait-readout" aria-hidden="true">
                {probe.v} / 255
              </span>
            </>
          )}
        </div>

        {status !== 'photo-only' && (
          <div className="colorbar" aria-hidden="true">
            <div className="colorbar-ramp" />
            <div className="colorbar-ticks">
              {TICKS.map((t) => (
                <span key={t} style={{ bottom: `${(t / 255) * 100}%` }}>{t}</span>
              ))}
              {showProbe && (
                <i className="colorbar-marker" style={{ bottom: `${(probe.v / 255) * 100}%` }} />
              )}
            </div>
          </div>
        )}
      </div>

      {status === 'ready' && (
        <figcaption className="portrait-caption">
          <p>False colour: brightness mapped onto a thermal scale. Hover to read it.</p>
          <div className="seg" role="group" aria-label="Portrait view">
            <button
              type="button"
              aria-pressed={!thermalOn}
              onClick={() => thermalOn && switchMode('visible')}
            >
              Photo
            </button>
            <button
              type="button"
              aria-pressed={thermalOn}
              onClick={() => !thermalOn && switchMode('thermal')}
            >
              Thermal
            </button>
          </div>
        </figcaption>
      )}
    </figure>
  );
}
