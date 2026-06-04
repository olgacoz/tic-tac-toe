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

  const getActivePlayer = () => activePlayer;
  const switchActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
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

  const checkWin = () => {
    // will check for (Horizontal, Vertial, Diagonal) win.

  }

  const playRound = (row, col) => {
    const moveValid = gameBoard.placeToken(row, col, activePlayer.getToken());

    // gotta make here working
    if (moveValid) {
      console.log(`Putting ${getActivePlayer().getName()}'s token into (${row},${col})`);

      if (checkWin()) {
        console.log(`${activePlayer.getName()} wins!`);
        activePlayer.incrementScore();
        return;
      } else if (gameBoard.isFull()) {
        console.log(gameBoard.getGrid());
        console.log(`It's a draw!`);
        return;
      }

      switchActivePlayer();
      printNewRound();
    } else {
      console.log("That space is already occupied! Try again.");
    }
  };

  printNewRound();

  return { getActivePlayer, playRound };
};

const game = gameController();