import React, { useState, useEffect } from 'react';
import './Board.css';
import io from 'socket.io-client';
import { calculateWinner, isBoardFull } from './IsWinner';
import { Square } from './Square';

const socket = io(); // Connects to socket connection
export default socket;
export function Board(props) {
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']); // sets board to empty array
  const [isX, setX] = useState(true); // useState for who's turn it is
  const { currUser, players, playerRef } = props;
  function resetBoard() {
    const boardCopy = ['', '', '', '', '', '', '', '', '']; // reset the board
    setBoard(boardCopy);
    setX(true); // player X always goes first
    socket.emit('resetBoard', { board: boardCopy, isX: true });
  }
  function displayWinner(currBoard) {
    let result = '';
    if (isBoardFull(currBoard) && !calculateWinner(currBoard)) {
      // if it is a full board and no winner, it is a draw
      result = (
        <div>
          <p>
            <b>It is a draw!</b>
          </p>
        </div>
      );
    } else if (calculateWinner(currBoard)) {
      // if there is a winner
      if (calculateWinner(currBoard) === 'X') {
        // if the winner is player X, display message
        result = (
          <div>
            {' '}
            <p>
              {' '}
              The winner is
              {' '}
              <b>{props.players.PlayerX}</b>
              !
            </p>
          </div>
        );
      }
      if (calculateWinner(currBoard) === 'O') {
        // if the winner is player O, display message
        result = (
          <div>
            <p>
              <b>
                The winner is
                {props.players.PlayerO}
              </b>
              !
            </p>
          </div>
        );
      }
    }
    if (result !== '') {
      // only display play again button if there is a winner or draw
      return (
        <div className="players">
          {result}
          <button type="button" className="again" onClick={resetBoard}>
            Play Again
          </button>
        </div>
      );
    }
    return <div />;
  }
  function canClickBoard() {
    if (props.players.Spectators.includes(props.currUser)) {
      // if they are a spectator, can't click board
      return false;
    }
    if (displayWinner(board)) {
      // once there is a winner, can't click board
      return false;
    }
    if (props.players.PlayerX !== '' && props.players.PlayerO !== '') {
      // only if there are two players logged in
      if (
        (isX && props.currUser === props.players.PlayerX)
        || (!isX && props.currUser === props.players.PlayerO)
      ) {
        // and it is current users turn, can click board
        return true;
      }
    }
    return false;
  }
  function updateWinner(currBoard) {
    if (calculateWinner(currBoard) === 'X') {
      // if the winner is player X, add X as winner, O as loser
      socket.emit('winner', {
        winner: props.players.PlayerX,
        loser: props.players.PlayerO,
      });
    } else if (calculateWinner(currBoard) === 'O') {
      // if the winner is player O, add O as winner, X as loser
      socket.emit('winner', {
        winner: props.players.PlayerO,
        loser: props.players.PlayerX,
      });
    }
  }

  function onClickSquare(index) {
    if (canClickBoard()) {
      // if they're allowed to play
      const newBoard = [...board];
      if (newBoard[index] === '') {
        // if the board value has not been assigned yet
        newBoard[index] = isX ? 'X' : 'O';
        setBoard(newBoard);
        setX(!isX);
        if (calculateWinner(newBoard)) {
          updateWinner(newBoard);
        }
        socket.emit('board', {
          board: newBoard[index],
          index,
          isX,
        }); // send updated board, updated turn and index
      }
    }
  }

  useEffect(() => {
    // listens for event emitted by server, if received, run code for corresponding channel
    socket.on('board', (data) => {
      console.log('Board event received!');
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[data.index] = data.isX ? 'X' : 'O';
        setX(!data.isX);
        return newBoard;
      });
      console.log(data);
    });
    socket.on('resetBoard', (data) => {
      setBoard(data.board);
      setX(data.isX);
    });
  }, []);

  function displayPlayers() {
    let playerBoardX = '';
    let playerBoardO = '';
    let playerBoardSpect = '';
    if (props.players.PlayerX !== '') {
      // only shows users who have logged in
      playerBoardX = (
        <div>
          <p>
            Player X:
            {props.players.PlayerX}
          </p>
        </div>
      );
      if (props.players.PlayerO !== '') {
        playerBoardO = (
          <div>
            <p>
              Player O:
              {props.players.PlayerO}
            </p>
          </div>
        );
        if (props.players.Spectators !== '') {
          playerBoardSpect = (
            <div>
              <p>
                Spectators:
                {' '}
                {props.players.Spectators.map((item) => (
                  <div>{item}</div>
                ))}
              </p>
            </div>
          );
        }
      }
    }
    if (
      props.players.PlayerX !== ''
      || props.players.PlayerO !== ''
      || props.players.Spectators !== ''
    ) {
      return (
        <div>
          <div className="players">
            <br />
            <h2 className="welcome">
              Welcome to Tic Tac Toe
              {' '}
              <b>{currUser}</b>
            </h2>
            {playerBoardX}
            {playerBoardO}
            {playerBoardSpect}
            {isX ? (
              <p>
                {' '}
                {players.PlayerX}
                `&apos;`s turn
              </p>
            ) : (
              <p>
                {' '}
                {players.PlayerO}
                `&apos;`s turn
                {' '}
              </p>
            )}
          </div>
        </div>
      );
    }
    return <div />;
  }
  if (playerRef != null) {
    return (
      <div>
        {displayPlayers()}
        <div className="board">
          <Square onClickSquare={onClickSquare} board={board} index={0} />
          <Square onClickSquare={onClickSquare} board={board} index={1} />
          <Square onClickSquare={onClickSquare} board={board} index={2} />
          <Square onClickSquare={onClickSquare} board={board} index={3} />
          <Square onClickSquare={onClickSquare} board={board} index={4} />
          <Square onClickSquare={onClickSquare} board={board} index={5} />
          <Square onClickSquare={onClickSquare} board={board} index={6} />
          <Square onClickSquare={onClickSquare} board={board} index={7} />
          <Square onClickSquare={onClickSquare} board={board} index={8} />
        </div>
        {displayWinner(board)}
      </div>
    );
  }
}
