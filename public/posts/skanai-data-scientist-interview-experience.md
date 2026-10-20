# Skan AI — Data Scientist Intern Interview Experience

*Published on August 15, 2025 • 9 min read*

> **Disclaimer**: *AI was used to summarize and structure this interview experience from my personal notes taken during the on-campus internship season. The original questions, flow, and storytelling have been preserved without fabricating unmentioned content.*

---

## Overview

- **Company**: Skan AI
- **Role**: Data Scientist Intern
- **Season & Type**: On-Campus Internship (2025)
- **Verdict**: **Selected (Offer Received)**

---

## Online Assessment (OA)

- **Platform**: Glider.AI
- **Duration**: 31 minutes (MCQ) + 61 minutes (Coding)
- **Structure**:
  - **Section 1 (MCQs)**: Machine learning concepts (decision trees, linear/logistic regression, regularization), deep learning architectures (RNNs, LSTMs, GRUs), and fundamental probability and statistics (hypothesis testing, z-tests, Bayes' theorem, dimensionality reduction).
  - **Section 2 (Coding)**: 3 algorithmic questions focusing heavily on **Graphs (BFS/DFS)**, **Dynamic Programming**, and **Greedy** strategies.

### Preparation Tips
- Revise ML fundamentals using Prof. Nipun Batra's *ES335: Machine Learning* course slides.
- Skim through *Top 50 ML Interview Questions* and *Data Science Questions* on GeeksforGeeks.
- For DSA, past questions often highlight graph traversal and DP patterns. Always begin with a brute-force approach to pass preliminary test cases if optimization isn't immediately obvious.

---

## Interview Round 1 — Research & ML Fundamentals (30–45 Minutes)

- **Platform**: Microsoft Teams
- **Duration**: ~30–45 minutes

The interviewers were extremely friendly and conversational. Having substantial research experience on the resume was a major differentiator.

### Research Discussion (25–30 Minutes)
- Spent nearly 25 to 30 minutes in an interactive, to-and-fro discussion regarding my research project with Prof. Nipun Batra (conducted as a semester-long project and SRIP intern, resulting in a conference paper submission).
- Explained the problem formulation, methodology, experimental setup, and quantitative results in detail.

### ML & Dimensionality Reduction
- **Core ML**: Decision trees, the bias-variance tradeoff, sampling strategies, and ensemble boosting techniques.
- **Dimensionality Reduction (In-Depth)**:
  - Deep-dive into **Principal Component Analysis (PCA)**: One prerequisite step in PCA is normalization/standardization—*why do we do it? What happens geometrically if we omit it?*
  - **Autoencoders**: Discussed neural network-based non-linear dimensionality reduction.
- Concluded with a thoughtful discussion where I asked questions about their engineering stack.

---

## Interview Round 2 — Projects, Vision-Language & Algorithms (45–60 Minutes)

- **Platform**: Microsoft Teams
- **Duration**: ~45–60 minutes

### Project Deep-Dives
- Again spent 20–25 minutes discussing the research project before branching into other projects on my resume:
  - **Multi-Agentic RAG System**: Discussed my legal simulator project from Inter-IIT Tech Meet 13. Explained different architectural paradigms of RAG systems (dynamic, corrective, adaptive).
  - **VLM Fine-Tuning & Parameter-Efficient Adaptation**: Explained the mathematical principles behind **LoRA** (Low-Rank Adaptation), adapter placement between transformer layers, and memory-quantized **QLoRA**.
  - **Attention Mechanism**: Even without having formally completed advanced courses yet, I walked through the core intuition, mathematical formulation, and why scaled dot-product attention works.

### Metrics & Algorithms
- **Similarity & Distance Metrics**: Compared Cosine similarity, Jaccard distance, and Euclidean distance, elaborating on when to choose which.
- **Edit Distance**: The interviewer introduced the classic Edit Distance problem and explained how Skan AI adapted Edit Distance as a specialized domain metric in their ongoing production projects. We had an engaging discussion exploring alternative strategies and trade-offs.

---

## Interview Round 3 — Open-Ended Problem Solving (20–25 Minutes)

- **Platform**: Zoom
- **Duration**: ~20–25 minutes

This round had no standard introductory small talk—straight to open-ended technical problem solving to evaluate how candidates reason under uncertainty.

### Question 1: Habit & Pattern Recognition
- **Problem**: Given a sequence of human activities over time, identify common habits and recurring activity sequences.
- **Thought Process**:
  - The problem is intentionally open-ended. I asked clarifying questions upfront to remove ambiguity.
  - Walked through 8 to 9 different approaches, analyzing why each would or wouldn't work:
    - Sequence sliding-window brute force.
    - Text tokenization analogies and Byte Pair Encoding (BPE).
    - Representing activity sequences as embeddings followed by dense similarity search.
    - Graph modeling: converting activities into graph nodes and applying path-search algorithms.
    - Binary search on sequence length combined with string hashing ($Z$-algorithm / Rabin-Karp).
  - Maintained an active "think out loud" approach, reasoning through failure modes until exhausting possibilities.

### Question 2: Color-Based Box Clustering
- **Problem**: Defining a similarity metric between boxes containing arbitrary multi-color distributions.
- **Approach**: Formulated a structured similarity metric based on color overlap and set distance. The interviewer was satisfied with the directional reasoning before concluding the round.

---

## Outcome

- **Status**: **Selected**
- **Verdict**: Received the **Data Scientist Intern** offer at Skan AI!
