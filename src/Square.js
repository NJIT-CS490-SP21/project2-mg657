import React from 'react';
import PropTypes from 'prop-types';
import './Square.css';

export function Square(props) {
  const { onClickSquare, board, index } = props;
  return (
    <div
      role="button"
      tabIndex={0}
      className="box"
      onClick={() => {
        onClickSquare(index);
      }}
      onKeyPress={() => {
        onClickSquare(index);
      }}

    >
      {board[index]}
    </div>
  );
}
Square.propTypes = {
  onClickSquare: PropTypes.func.isRequired,
  board: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
};
export default Square;
