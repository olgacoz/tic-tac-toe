# tic-tac-toe

A clean, browser-based Tic-Tac-Toe game built with HTML, CSS, and JavaScript focusing on modern design patterns.

[Live Demo](https://olgacoz.github.io/tic-tac-toe/)

<img width="1470" height="835" alt="Screenshot 2026-06-09 at 08 06 34" src="https://github.com/user-attachments/assets/9df4ebdb-f6b2-4f88-bf56-f53a8c31c4cc" />

## Concepts Applied

- **Module Pattern (IIFE):** Encapsulated the code into `gameBoard`, `game`, and `displayController` modules to prevent global scope pollution.
- **Factory Functions & Closures:** Created a `createPlayer` factory that maintains private state for scores and names without using classical classes.
- **Separation of Concerns (SoC):** Separated the pure game rules from the UI logic, allowing the engine to run independently of the DOM.
- **Scalable Logic:** Implemented dynamic loops to check win conditions, ensuring the algorithm works for any grid size (n x n) rather than just a hardcoded 3 x 3 board.
- **Event Delegation:** Attached a single click listener to the board container rather than adding individual listeners to every cell.
