const gameBoard = (() => {
  const board = [];
  const boardSize = 3;

  const populateBoard = () => {
    for (let i = 0; i < boardSize; i++) {
      board.push([]);

      for (let j = 0; j < boardSize; j++) {
        board[i].push('');
      }
    }
  };
  const getBoard = () => board;

  populateBoard();

  return { populateBoard, getBoard };
})();

const createPlayer = (name, token) => {
  const getName = () => name;
  const getToken = () => token;

  const makeMove = (row, col) => {
    const board = gameBoard.getBoard();

    board[row][col] = token;
  }

  return { getName, getToken, makeMove };
};

const gameController = () => {
  const player1 = createPlayer('Player 1', 'x');
  const player2 = createPlayer('Player 2', 'o');
  const board = gameBoard.getBoard();

  let activePlayer = player1;

  const getActivePlayer = () => activePlayer;
  const switchActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const printNewRound = () => {
    console.log(board);
    console.log(`It's ${getActivePlayer().getName()}'s turn.`);
  };

  const playRound = (row, col) => {
    if (board[row][col] === '') {
      console.log(`Putting ${getActivePlayer().getName()}'s token into (${row},${col})`);
      activePlayer.makeMove(row, col);

      switchActivePlayer();
      printNewRound();
    }
  }

  printNewRound();

  return { getActivePlayer, playRound };
};