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