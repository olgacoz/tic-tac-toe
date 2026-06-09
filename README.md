# tic-tac-toe

A clean, browser-based Tic-Tac-Toe game built with HTML, CSS, and JavaScript focusing on modern design patterns.

[Live Demo](https://olgacoz.github.io/tic-tac-toe/)

## Concepts Applied

- **Module Pattern (IIFE):** Encapsulated the code into `gameBoard`, `game`, and `displayController` modules to prevent global scope pollution.
- **Factory Functions & Closures:** Created a `createPlayer` factory that maintains private state for scores and names without using classical classes.
- **Separation of Concerns (SoC):** Separated the pure game rules from the UI logic, allowing the engine to run independently of the DOM.
- **Scalable Logic:** Implemented dynamic loops to check win conditions, ensuring the algorithm works for any grid size (n x n) rather than just a hardcoded 3 x 3 board.
- **Event Delegation:** Attached a single click listener to the board container rather than adding individual listeners to every cell.