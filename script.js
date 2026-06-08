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
  const setName = (newName) => { name = newName; };
  const getToken = () => token;
  const getScore = () => score;
  const incrementScore = () => { score++; };
  const resetScore = () => { score = 0; };

  return { getName, getToken, getScore, incrementScore, resetScore, setName };
};

const game = (() => {
  const player1 = createPlayer('Player 1', 'X');
  const player2 = createPlayer('Player 2', 'O');

  let activePlayer = player1;
  let gameOver = false;

  const isGameOver = () => gameOver;
  const getActivePlayer = () => activePlayer;
  const switchActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };
  const getPlayers = () => [player1, player2];

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
    if (gameOver) {
      return;
    }

    const moveValid = gameBoard.placeToken(row, col, activePlayer.getToken());
    const grid = gameBoard.getGrid();

    if (moveValid) {
      if (checkWin(grid, activePlayer.getToken())) {
        activePlayer.incrementScore();
        gameOver = true;
        return;
      } else if (gameBoard.isFull()) {
        gameOver = true;
        return;
      }

      switchActivePlayer();
    }
  };

  const restart = () => {
    gameOver = false;
    activePlayer = player1;
  };

  return { getActivePlayer, playRound, restart, isGameOver, getPlayers };
})();

const displayController = (() => {
  const boardDiv = document.querySelector('#game-board');
  const startRestartBtn = document.querySelector('#start-restart-btn');
  const gameInfoDiv = document.querySelector('#game-info');
  const scoreboardDiv = document.querySelector('#scoreboard');
  const player1NameInput = document.querySelector('#player1');
  const player2NameInput = document.querySelector('#player2');

  let startRestartBtnPressed = false;

  const printTurnMsg = () => {
    const activePlayerName = game.getActivePlayer().getName();
    const activePlayerToken = game.getActivePlayer().getToken();

    gameInfoDiv.textContent = `It's ${activePlayerName}'s turn (${activePlayerToken})`;
  };

  const printWinnerMsg = (winnerName) => {
    gameInfoDiv.textContent = `${winnerName} win!`;
  };

  const printDrawMsg = () => {
    gameInfoDiv.textContent = `It's a draw!`;
  };

  const printScores = () => {
    const [player1, player2] = game.getPlayers();

    scoreboardDiv.textContent = `${player1.getName()}: ${player1.getScore()} | ${player2.getName()}: ${player2.getScore()}`;
  }

  const renderEmptyBoard = () => {
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

    printScores();
  };

  const updateBoardDisplay = () => {
    const grid = gameBoard.getGrid();
    const gridSize = grid.length;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        cell.textContent = grid[row][col];

        if (grid[row][col] === 'X') {
          cell.classList.add('blue');
        } else if (grid[row][col] === 'O') {
          cell.classList.add('red');
        }
      }
    }

    if (gameBoard.isFull()) {
      printDrawMsg();
      printScores();
      startRestartBtnPressed = false;
    } else if (game.isGameOver()) { // board is not full and game is over
      printWinnerMsg(game.getActivePlayer().getName());
      printScores();
      startRestartBtnPressed = false;
    } else {
      printTurnMsg();
    }
  };

  boardDiv.addEventListener('click', (e) => {
    if (!e.target.classList.contains('cell')) return; // clicked somewhere like border on the board

    if (startRestartBtnPressed) {
      const clickedRow = parseInt(e.target.dataset.row);
      const clickedCol = parseInt(e.target.dataset.col);
      game.playRound(clickedRow, clickedCol);
      updateBoardDisplay();
    }
  });

  startRestartBtn.addEventListener('click', () => {
    const [player1, player2] = game.getPlayers();

    player1.setName(player1NameInput.value.trim() === '' ? 'Player 1' : player1NameInput.value);
    player2.setName(player2NameInput.value.trim() === '' ? 'Player 2' : player2NameInput.value);

    startRestartBtnPressed = true;

    gameBoard.clear();
    game.restart();
    renderEmptyBoard();
    printTurnMsg();
  });

  renderEmptyBoard();

})();