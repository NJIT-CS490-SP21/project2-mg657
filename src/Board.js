import React from 'react';
import './Board.css';
import {useState, useRef, useEffect} from 'react';
import {Square} from './Square.js';
import io from 'socket.io-client';
const socket = io(); // Connects to socket connection
export function Board(){
    const [board, setBoard] = useState(["","","","","","","","",""]);
    const [ isX, setX ] = useState(true);
    function onClickSquare(index){
        let newBoard = [...board];
        newBoard[index] = isX ? "X" : "O";
        setBoard(prevBoard =>newBoard);
        setX(!isX);
        socket.emit('board', {board: newBoard[index], index: index, isX: isX});
  }
  
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('board', (data) => {
      console.log('Board event received!');
      setBoard(prevBoard =>{
        let newBoard = [...prevBoard];
        newBoard[data.index] = data.isX ? "X" : "O";
        setX(!data.isX);
        return (newBoard)
      });
      console.log(data);
    });
  }, []);
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