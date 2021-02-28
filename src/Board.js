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
    const [playerX, setPlayerX] = useState(false);
    const [playerO, setPlayerO] = useState(false);
    const [spectators, setSpectators] = useState(false);
    function onClickSquare(index){
        let newBoard = [...board];
        const currUser = playerRef.current.value;
        if(players["Spectators"].includes(currUser)){
          return;
        }
        newBoard[index] = isX ? "X" : "O";
        setBoard(prevBoard =>newBoard);
        setX(!isX);
        socket.emit('board', {board: newBoard[index], index: index, isX: isX});
  }
 
  
  function isDraw(board){
    var winner = "";
    if(isBoardFull(board) && !calculateWinner(board)){
      winner = <p>It is a draw</p>;}
    else{
      winner = <p>The winner is <div>{calculateWinner(board)}!</div></p>;}
    return winner;
  }
 
  function onClickButton() {
    if (playerRef != null) {
      setLog(true);
      const player = playerRef.current.value;
      var playerCopy = {...players};
      if (playerCopy["PlayerX"]!="" && playerCopy["PlayerO"]!=""){
        playerCopy["Spectators"].push(player);
        setSpectators(true);
      }
      else if (playerCopy["PlayerX"]==""){
        playerCopy["PlayerX"] = player;
        setPlayerX(true);
      }
      else if (playerCopy["PlayerX"]!="" && playerCopy["PlayerO"]==""){
        playerCopy["PlayerO"] = player;
        setPlayerO(true);
      }
      setPlayers(playerCopy);
      socket.emit('login', {players: playerCopy});
    }
  }
   function displayPlayers(){
    if(playerX || playerO || spectators){
      return (<div><h3>Player X</h3>{players["PlayerX"]}
      <h3>Player O</h3> {players["PlayerO"]}
      <h3>Spectators</h3>
      {players["Spectators"].map((item) => <p>{item} </p> )}
      {isLogged ? 
            <div>
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
    </div>:null}</div>);
    }
    else{
      return;
    }
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
    <h1>Login </h1>
    <input ref={playerRef} type="text" placeholder = "Enter Username" />
    <button onClick={onClickButton}>Submit</button>
    {displayPlayers()}
    </div>);
}