# Eternal — SDE 1 Interview Experience

*Published on October 9, 2026 • 8 min read*

> **Disclaimer**: *AI was used to summarize and structure this interview experience from my personal notes taken during the placement season. The original questions, flow, and storytelling have been preserved without fabricating unmentioned content.*

---

## Overview

- **Company**: Eternal
- **Role**: Software Development Engineer 1 (SDE 1)
- **Season & Type**: On-Campus Placement (2026)
- **Verdict**: **Selected (Offer Received)**

---

![With the Eternal Hiring Team](/images/Eternal_final.jpg)

## Online Assessment (OA)

The online assessment had 3 algorithmic problems:

1. **Tree Minimum Depth Operations**:
   Given the edges of a tree and `max_operations`, return the minimum possible depth of the tree after performing all operations. In a single operation, you can break any edge and attach that subtree directly to the root.
2. **Subarrays with Odd Number of Divisors**:
   Given a list of numbers in an array, return the count of all possible subarrays whose product has an odd number of divisors.
3. **Playlist Shuffle Feature**:
   Implement a custom shuffle-play algorithm for a 2D playlist where each entry is `[Artist, Song]` under the following constraints:
   - Always play the song of the artist with the most remaining songs in the playlist first.
   - In case of a tie, prioritize the artist whose song appeared first in the playlist.
   - You cannot play songs of the same artist consecutively.
   - If only one artist remains, play their remaining songs in their existing order.

---

## Round 1 — Technical (1 Hour)

The round began with an introduction and a detailed discussion about what I worked on during my previous internship. 

### Coding & Fundamentals
- Started with a simple **FizzBuzz** implementation.
- Progressively added more `if-else` constraints and refactored the logic cleanly into modular functions.

### Operating Systems, Caching & Concurrency
- **Cache Replacement Algorithms**: Explained different caching strategies with practical examples.
- **Mobile Systems**: Discussed which caching algorithm is typically used in mobile phone caches.
- **CPU Scheduling**: Walked through all standard scheduling algorithms and analyzed their respective drawbacks and bottlenecks.
- **Race Conditions**:
  - *Problem*: Given 2 threads modifying the same shared variable for 100 steps, what are the theoretical minimum and maximum possible values?
- **Deadlocks**:
  - Wrote code demonstrating deadlock conditions.
  - Explained the four necessary Coffman conditions for deadlocks and concrete prevention strategies.
- **Concurrency Models**: Compared concurrency vs. multithreading vs. multiprocessing.

### OOPs & Language Internals (Python & C++)
- **Four Pillars of OOP**: Walked through encapsulation, abstraction, inheritance, and polymorphism in both Python and C++.
- **Python Internals**: Constructors, destructors, and dunder (`__init__`, `__str__`, etc.) methods.
- **Mutability & Hashing**: Mutable vs. immutable data types, and how hashability and dictionary key support are handled for both.

### Databases & Storage Engines
- **Database ER Modeling**: Discussed ER diagrams and integrity constraints.
- **Foreign Keys**: Answered whether a foreign key can point to any column and explained referential integrity rules.
- **Indexing**: Database indexing internals and **B+ Tree** lookups.
- **Architectural Tradeoffs**: SQL vs. NoSQL systems and when to use each.

---

## Round 2 — Technical (2 Hours)

This was an extensive two-hour deep-dive spanning systems design, algorithms, and distributed systems fundamentals.

### Internship Architecture & Distributed Caching
- **Internship Project Review**: Detailed breakdown of my internship architecture and discussed potential incremental improvements.
- **Cache Acceleration**: Discussed what makes caches fast at hardware and software levels.
- **Cache Stampede**: Explained the cache stampede problem (thundering herd) and mitigation strategies.
- **Consistent Hashing**: Walked through the consistent hashing ring algorithm and node distribution.
- **Hot Sharding**: Analyzed hot shards in distributed databases and methods for prevention.

### System Design & Algorithms
- **Design Tic-Tac-Toe (N × N Grid)**:
  - Wrote the complete production-quality code for an arbitrary $N \times N$ grid, managing turn state, move validation, and $O(1)$ win checking per move.
- **$O(1)$ Dice Data Structure**:
  - Designed a data structure supporting `add(val)`, `delete(val)`, and `roll()` all in $O(1)$ time complexity:
    - `add(val)`: Adds an integer if not already present.
    - `delete(val)`: Deletes an integer.
    - `roll()`: Uniformly selects any currently present integer with equal probability.
- **Hungarian Algorithm**:
  - Discussed the Hungarian algorithm for bipartite matching and optimal assignment.

---

## Round 3 — HR (45 Minutes)

Focused on cultural alignment, past teamwork challenges, work ethics, role expectations, and long-term vision.

---

## Outcome

- **Status**: **Selected**
- **Verdict**: Received the full-time **SDE 1** offer at Eternal!
