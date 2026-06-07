const gameBoard = (() => {
  const board = [];
  const boardSize = 3; // means 3 x 3

  const clear = () => {
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];

      for (let j = 0; j < boardSize; j++) {
        board[i][j] = '';
      }
    }
  };

  const getGrid = () => board;
  const getSize = () => boardSize;

  const isFull = () => {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === '') {
          return false;
        }
      }
    }
    return true;
  };

  const placeToken = (row, col, token) => {
    if (board[row][col] === '') {
      board[row][col] = token;
      return true;
    }
    return false;
  }

  clear();

  return { clear, getGrid, isFull, getSize, placeToken };
})();

const createPlayer = (name, token) => {
  let score = 0;

  const getName = () => name;
  const getToken = () => token;
  const getScore = () => score;
  const incrementScore = () => { score++; };
  const resetScore = () => { score = 0; };

  return { getName, getToken, getScore, incrementScore, resetScore };
};

const gameController = () => {
  const player1 = createPlayer('Player 1', 'x');
  const player2 = createPlayer('Player 2', 'o');

  let activePlayer = player1;
  let isGameOver = false;

  const getActivePlayer = () => activePlayer;
  const switchActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const printScores = () => {
    console.log(`SCORES: ${player1.getName()}: ${player1.getScore()} | ${player2.getName()}: ${player2.getScore()}`);
  };

  const printNewRound = () => {
    console.log(gameBoard.getGrid());
    console.log(`It's ${getActivePlayer().getName()}'s turn.`);
  };

  // All winner checking functions works for n x n matrices
  const checkHorizontalWin = (grid, token) => {
    const gridSize = grid.length;
    let tokenCounter = 0;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] !== token) {
          tokenCounter = 0;
          break;
        } else {
          tokenCounter++;
        }
      }
      if (tokenCounter === gridSize) {
        return true;
      }
    }

    return false;
  };

  const checkVerticalWin = (grid, token) => {
    const gridSize = grid.length;
    let tokenCounter = 0;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[j][i] !== token) {
          tokenCounter = 0;
          break;
        } else {
          tokenCounter++;
        }
      }
      if (tokenCounter === gridSize) {
        return true;
      }
    }

    return false;
  };

  const checkDiagonalWin = (grid, token) => {
    const gridSize = grid.length;
    let tokenCounter = 0;

    // check for main diagonal first
    for (let i = 0; i < gridSize; i++) {
      if (grid[i][i] !== token) {
        // we couldn't win in main diagonal
        tokenCounter = 0;
        break;
      } else {
        tokenCounter++;
      }
    }
    if (tokenCounter === gridSize) {
      return true;
    } else {
      tokenCounter = 0;
    }

    // check for secondary diagonal
    for (let i = 0; i < gridSize; i++) {
      if (grid[i][gridSize - 1 - i] !== token) {
        // we couldn't win on either the main diagonal or the secondary diagonal.
        return false;
      }
    }
    return true; // we win in secondary diagonal!
  };

  const checkWin = (grid, token) => {
    return (
      checkDiagonalWin(grid, token) ||
      checkHorizontalWin(grid, token) ||
      checkVerticalWin(grid, token)
    );
  };

  const playRound = (row, col) => {
    if (isGameOver) {
      return;
    }

    const moveValid = gameBoard.placeToken(row, col, activePlayer.getToken());
    const grid = gameBoard.getGrid();

    if (moveValid) {
      console.log(`Putting ${getActivePlayer().getName()}'s token into (${row},${col})`);

      if (checkWin(grid, activePlayer.getToken())) {
        console.log(grid);
        console.log(`${activePlayer.getName()} wins!`);

        activePlayer.incrementScore();
        printScores();
        isGameOver = true;

        return;
      } else if (gameBoard.isFull()) {
        console.log(grid);
        console.log(`It's a draw!`);

        printScores();
        isGameOver = true;

        return;
      }

      switchActivePlayer();
      printNewRound();
    } else {
      console.log("That space is already occupied! Try again.");
    }
  };

  const restart = () => {
    isGameOver = false;
    activePlayer = player1;
    console.log('New game has been started!');
    printNewRound();
  };

  printNewRound();

  return { getActivePlayer, playRound, restart };
};

const displayController = (() => {
  const game = gameController();

  const boardDiv = document.querySelector('#game-board');
  const playAgainBtn = document.querySelector('#play-again-btn');
  const currentTurn = document.querySelector('#current-turn');
  const winnerMsg = document.querySelector('#winner-msg');

  const printTurn = () => {
    const activePlayerName = game.getActivePlayer().getName();
    const activePlayerToken = game.getActivePlayer().getToken();

    currentTurn.textContent = `It's ${activePlayerName}'s turn (${activePlayerToken})`;
  }

  const renderEmptyBoard = (() => {
    const grid = gameBoard.getGrid();
    const gridSize = grid.length;

    boardDiv.textContent = '';
    boardDiv.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
    boardDiv.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div');

        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.textContent = grid[row][col];

        boardDiv.appendChild(cell);
      }
    }

    printTurn();
  })();

  const updateBoardDisplay = () => {
    const grid = gameBoard.getGrid();
    const gridSize = grid.length;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        cell.textContent = grid[row][col];
      }
    }

    printTurn();
  };

  boardDiv.addEventListener('click', (e) => {
    if (!e.target.classList.contains('cell')) return; // clicked somewhere like border on the board

    const clickedRow = parseInt(e.target.dataset.row);
    const clickedCol = parseInt(e.target.dataset.col);
    game.playRound(clickedRow, clickedCol);
    updateBoardDisplay();
  });

  playAgainBtn.addEventListener('click', () => {
    gameBoard.clear();
    game.restart();
    updateBoardDisplay();
  });

})();