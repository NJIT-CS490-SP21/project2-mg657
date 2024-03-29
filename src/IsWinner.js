export function calculateWinner(squares) {
  const possibleLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Run through all possible winning lines, check if they consist of only X's/only O's
  for (let i = 0; i < possibleLines.length; i += 1) {
    const [a, b, c] = possibleLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
export function isBoardFull(squares) {
  for (let i = 0; i < squares.length; i += 1) {
    if (squares[i] === '') {
      return false;
    }
  }
  return true;
}
