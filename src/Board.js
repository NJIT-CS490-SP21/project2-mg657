import React from 'react';
import './Board.css';
import {useState} from 'react';
import {Square} from './Square.js';
export function Board(){
    const [board, setBoard] = useState(["","","","","","","","",""]);
    const [ isX, setX ] = useState(true);
    function onClickSquare(index){
        let newBoard = [...board];
        newBoard[index] = isX ? "X" : "O";
        setBoard(prevBoard =>newBoard);
        setX(!isX);
      
    }
  return (
    <div class="board">
    <Square onClickSquare={onClickSquare} board={board} index={0} />
    <Square onClickSquare={onClickSquare} board={board} index={1} />
    <Square onClickSquare={onClickSquare} board={board} index={2} />
    <Square onClickSquare={onClickSquare} board={board} index={3} />
    <Square onClickSquare={onClickSquare} board={board} index={4} />
    <Square onClickSquare={onClickSquare} board={board} index={5} />
    <Square onClickSquare={onClickSquare} board={board} index={6} />
    <Square onClickSquare={onClickSquare} board={board} index={7} />
    <Square onClickSquare={onClickSquare} board={board} index={8} />
    </div>);
}