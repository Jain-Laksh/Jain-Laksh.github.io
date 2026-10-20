# Amazon — Applied Scientist Intern Interview Experience

*Published on March 5, 2026 • 8 min read*

> **Disclaimer**: *AI was used to summarize and structure this interview experience from my personal notes taken during the off-campus recruitment season. The original questions, flow, and storytelling have been preserved without fabricating unmentioned content.*

---

## Overview

- **Company**: Amazon
- **Role**: Applied Scientist Intern
- **Season & Type**: Off-Campus Internship (2026)
- **Verdict**: **Reached Final Round (Not Selected)**

---

## Online Assessment (OA)

- **2 Algorithmic Coding Questions**:
  - Implementation of **Merge Sort** and analyzing its recursion tree.
  - **First Duplicate Element**: Finding the first recurring/duplicate element in an array efficiently.
- **Behavioral Section**: Questions aligned with Amazon's Leadership Principles.

---

## Round 1 — Data Structures & Algorithms

- **Platform**: Virtual Coding Environment
- **Focus**: Algorithmic problem solving and complexity analysis.

### Question 1: Search in a 2D Matrix II
- **Problem Statement**:
  - Given an $M \times N$ matrix where each row is sorted in ascending order from left to right, and each column is sorted in ascending order from top to bottom, determine whether a target integer exists in the matrix.
- **Discussion**:
  - Stepped through the coordinate elimination strategy starting from the top-right (or bottom-left) corner.
  - Analyzed time complexity ($O(M + N)$) and space complexity ($O(1)$).

### Question 2: K-th Largest Element in a Continuous Stream
- **Problem Statement**:
  - Design a data structure that maintains and returns the $k$-th largest element in a real-time, continuous stream of integers.
- **Discussion**:
  - Explained the min-heap approach of fixed size $k$, discussing heap property maintenance, insertion time ($O(\log k)$), and top retrieval ($O(1)$).

---

## Round 2 — Machine Learning & Multimodal Deep-Dive

- **Interviewer**: Aryamaan Thakur
- **Focus**: Deep-dive into statistical learning, probability, transformer internals, Vision-Language Models, and model compression.

### 1. Clustering & Seeding Mechanics
- **K-Means on Circular Distribution**:
  - *Scenario*: Given a continuous circular distribution with uniformly distributed points, if we run standard K-Means, will it always converge to the identical clusters?
  - *Follow-Up*: Formulated deterministic initialization strategies to ensure identical cluster assignments every run (e.g., sorting coordinates and fixing predetermined seed anchors).

### 2. Probability & Random Variable Transformations
- **Uniform to Exponential Transformation**:
  - Given a random variable $U \sim \text{Uniform}(0, 1)$, derive a mathematical transformation function to generate an exponentially distributed random variable.
- **Die Simulation with Coins**:
  - Given 3 fair coins, design a procedure to simulate a fair 6-sided die using **reject-and-repeat sampling**.

### 3. Vision-Language Models (VLMs) & Transformer Internals
- **Modern VLM Architecture**:
  - Walked through the macro-architecture of modern VLMs (vision encoder, projection connector, multimodal LLM backbone).
  - *Do we strictly need a text encoder?* Discussed autoregressive decoder-only formulations.
- **Tokenization & Positional Encodings**:
  - Traced inputs from raw byte/subword tokenization to embeddings.
  - The mathematical rationale behind **sinusoidal positional embeddings**.
  - Alternative schemes: 2D learned positional embeddings in vision transformers, and **Rotary Position Embedding (RoPE)**.
- **Attention Mechanics**:
  - Masked attention in autoregressive decoders (e.g., GPT-style backbones).
  - Inside a decoder layer: how layer dimensions vary across the feed-forward MLP, residual connections, and modern activation functions (e.g., SwiGLU, GeLU).
  - **Attention Formula**: Why do we divide by $\sqrt{d_k}$ in scaled dot-product attention? (Explained the mathematical stabilization of variance to prevent vanishing softmax gradients).
  - *Why do we need a feed-forward MLP immediately following self-attention?*
  - Computational complexity: Space and time complexity of standard quadratic attention.

### 4. Attention Optimizations & System Efficiency
- **Attention Variants**:
  - **Multi-Query Attention (MQA)** and **Grouped-Query Attention (GQA)**: KV head sharing and memory bandwidth savings.
  - **FlashAttention**: IO-awareness, tiling, and kernel fusion to eliminate HBM read/write bottlenecks.
  - **KV Caching**: Memory footprint across sequence generation.
  - *What kind of attention do frontier models use natively?* Discussed eager attention implementations.
  - Architectural comparisons: Familiarity with earlier multimodal cross-attention setups (such as DeepMind's Flamingo).

### 5. Model Compression & Quantization
- **Parameter Distribution**: Which model components house the largest parameter footprints.
- **Knowledge Distillation**: Formulating the distillation loss using **Kullback-Leibler (KL) Divergence** and interpreting what it measures.
- **Quantization**: Post-training quantization paradigms, symmetric vs. asymmetric quantization, and second-order methods like **GPTQ**.

---

## Outcome

- **Status**: **Reached Final Round**
- **Verdict**: Advanced through the full interview process until the final stage, but was not selected.
