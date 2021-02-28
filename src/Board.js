import React from 'react';
import './Board.css';
import {useState, useRef, useEffect} from 'react';
import {calculateWinner, isBoardFull} from './IsWinner.js';
import {Square} from './Square.js';
import io from 'socket.io-client';
const socket = io(); // Connects to socket connection
export function Board(){
    const [board, setBoard] = useState(["","","","","","","","",""]);
    const [ isX, setX ] = useState(true);
    const [players, setPlayers] = useState({"PlayerX":"", "PlayerO": "", "Spectators": []}); // State variable, list of players
    const playerRef = useRef(null); // Reference to <input> element
    const [isLogged, setLog] = useState(false);
    
    function onClickSquare(index){
        const currUser = playerRef.current.value;
        if(players["Spectators"].includes(currUser)){
          return;
        }
        if(players["PlayerX"]!="" && players["PlayerO"]!=""){
          if((isX && currUser==players["PlayerX"]) || (!isX && currUser==players["PlayerO"])){
            let newBoard = [...board];
            newBoard[index] = isX ? "X" : "O";
            setBoard(newBoard);
            setX(!isX);
            socket.emit('board', {board: newBoard[index], index: index, isX: isX});
          }}
  }
 
  function isDraw(board){
    var winner = "";
    if(isBoardFull(board) && !calculateWinner(board)){
      winner = <p>It is a draw</p>;}
    else if (calculateWinner(board)){
      if(calculateWinner(board) == "X"){
        winner = <p>The winner is {players["PlayerX"]}!</p>;}
      if(calculateWinner(board) == "O"){
        winner = <p>The winner is {players["PlayerO"]}!</p>;}
      }
        return winner;
      }
      
  function onClickButton() {
    if (playerRef != null) {
      setLog(true);
      const player = playerRef.current.value;
      var playerCopy = {...players};
      if (playerCopy["PlayerX"]!="" && playerCopy["PlayerO"]!=""){
        playerCopy["Spectators"].push(player);
      }
      else if (playerCopy["PlayerX"]==""){
        playerCopy["PlayerX"] = player;
      }
      else if (playerCopy["PlayerX"]!="" && playerCopy["PlayerO"]==""){
        playerCopy["PlayerO"] = player;
      }
      setPlayers(playerCopy);
      socket.emit('login', {players: playerCopy});
    }
  }
  
   function displayPlayers(){
    if(players["PlayerX"]!="" || players["PlayerO"]!="" || players["Spectators"]!=""){
      return (<div><h3>Player X</h3>{players["PlayerX"]}
      <h3>Player O</h3> {players["PlayerO"]}
      <h3>Spectators</h3>
      {players["Spectators"].map((item) => <p>{item} </p> )}
      {isLogged ? 
            <div>
            {isX?<p>Player {players["PlayerX"]}'s turn</p>:<p>Player {players["PlayerO"]}'s turn</p>}
            
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
    </div>
    {isDraw(board)}
    <br />
    <button onClick={resetBoard}>Reset</button>
    </div>:null}</div>);
    }
    else{
      return;
    }
  }
  function resetBoard(){
    setBoard(["","","","","","","","",""]);
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
    socket.on('login', (data) => {
      console.log('Login event received!');
      var newPlayer = {...data.players}
      setPlayers(newPlayer);
      });
  }, []);
  console.log(players);
    return (
    <div>
    <h1>Login</h1>
    <input ref={playerRef} type="text" placeholder = "Enter Username" />
    <button onClick={onClickButton}>Submit</button>
    {displayPlayers()}
    
    </div>);
}