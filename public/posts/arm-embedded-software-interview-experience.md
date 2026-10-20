# ARM — Embedded Software Intern Interview Experience

*Published on January 25, 2026 • 7 min read*

> **Disclaimer**: *AI was used to summarize and structure this interview experience from my personal notes taken during the off-campus recruitment season. The original questions, code snippets, and flow have been preserved without fabricating unmentioned content.*

---

## Overview

- **Company**: ARM
- **Role**: Embedded Software Intern
- **Season & Type**: Off-Campus Internship (2026)
- **Final Round Location**: Bangalore (In-Person / Offline)
- **Verdict**: **Reached Final Round (Not Selected)**

---

## Online Assessment (OA)

The initial assessment evaluated foundational computer systems and programming competencies:
- **Coding Question 1**: Array manipulation and search.
- **Coding Question 2**: 1D Dynamic Programming problem.
- **Multiple Choice Questions (MCQs)**: Core data structures, sorting algorithms, time/space complexities, and Operating Systems (memory management, processes, threads).

---

## Interview Round 1 — C/C++ Systems Programming & Data Structures

- **Platform**: Virtual Technical Round

### 1. Pointers vs. Arrays in C
Analyzed the memory layout and differences between pointer assignments and array initializations:
```c
char *ptr = "welcome";
char arr[] = "welcome";
```
Walked through what each expression evaluates to:
- `arr` vs. `arr + 1`
- `arr[0]`
- `*arr`
- `*arr[1]` (and pointer dereference precedence)

### 2. Character Array Bubble Sort Logic
Examined array swapping behavior and loop invariants:
```c
char arr[] = "welcome";

for (int i = 0; i < arr.size() - 1; i++) {
    for (int i = 0; i < arr.size() - 1; i++) {
        if (arr[i] <= arr[i + 1]) continue;
        else {
            char temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
        }
    }
}
```

### 3. Digit & Place Value Reconstruction
Analyzed a digit processing and place-value arithmetic loop:
```c
int given = 7891;
int ans = 0;
int temp = given;
int num_digits = 0;
int place = 1;

while (temp > 0) {
    num_digits++;
    place = place * 10;
    temp = temp / (place);
}

int mul = place;
int pos = 10;

while (given > 0) {
    int digit = given % pos - (given % (pos / 10));
    ans += mul * digit;
    mul = mul / 10;
    given = given / pos;
    pos = pos * 10;
}
```

### 4. Bit Manipulation
Implemented a bit clearing utility function:
```c
int num = 0x1234abcd;
int bit_position = 16;

int clearbit(int num, int bit_pos) {
    return num & ~(1 << bit_pos);
}
```

### 5. Sorted Linked List Node Insertion
- **Problem**: Insert a node with value `target = 9` into an already sorted linked list with hex values: `4 -> 8 -> A -> F`.
- **Implementation**: Handled head insertion edge cases, traversal pointer comparisons (`curr <= target && next >= target`), and node pointer splicing.

---

## Interview Round 2 — CPU Verification & Architecture (Bangalore Offline)

- **Interviewer**: Team Lead, CPU Verification Team
- **Location**: ARM Office, Bangalore (In-Person)

### 1. Agentic Test Generation System Design
- **Problem Statement (Resume-Driven)**:
  - Design an autonomous **agentic system** capable of automatically writing test suites and edge cases for a **64-bit architecture**, given existing architectural specifications and constraints for a **32-bit system**.
- **Discussion**:
  - Leveraged background in AI agents and systems to discuss specification parsing, instruction set boundary condition mapping (address space expansion, register widening, overflow conditions), test synthesis, and automated simulation feedback loops.

### 2. Bitwise Logic & Puzzles
- **Power of Two**: Wrote a program to check if an integer is a power of 2 using bitwise operations (`n > 0 && (n & (n - 1)) == 0`).
- **Counting Set Bits**: Implemented and explained **Brian Kernighan's Algorithm** ($O(\text{set bits})$).
- **Bitwise Puzzle**: Solved a puzzle involving bit masking and state transitions.

### 3. Computer Architecture & Pipelining
- Discussed CPU pipelining fundamentals, pipeline hazards (data, structural, control), forwarding paths, and pipeline stalls.

---

## Outcome

- **Status**: **Reached Final Round**
- **Verdict**: Traveled to the ARM Bangalore office for the in-person final round. Advanced to the final stage, but was not selected.
