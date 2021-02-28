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
    const [currUser, setUser] = useState("");
    const [isReset, setReset] = useState(false);
    function onClickSquare(index){
      if (canClickBoard()){
        let newBoard = [...board];
        if(newBoard[index]==""){
          newBoard[index] = isX ? "X" : "O";
          setBoard(newBoard);
          setX(!isX);
          socket.emit('board', {board: newBoard[index], index: index, isX: isX});
        }
        
      }
  }
  function canClickBoard(){
    setUser(playerRef.current.value);
    if(players["Spectators"].includes(currUser)){
      return false;}
    if (isDraw(board)){
      return false;
    }
    if(players["PlayerX"]!="" && players["PlayerO"]!=""){
      if((isX && currUser==players["PlayerX"]) || (!isX && currUser==players["PlayerO"])){
      return true;
    }
    }
  }

 
  function isDraw(board){
    var winner = "";
    if(isBoardFull(board) && !calculateWinner(board)){
      return(<div><p>It is a draw</p><br /><button onClick={resetBoard}>Reset</button></div>);}
    else if (calculateWinner(board)){
      if(calculateWinner(board) == "X"){
        return(<div><p>The winner is Player {players["PlayerX"]}!</p><br /><button onClick={resetBoard}>Reset</button></div>);}
      if(calculateWinner(board) == "O"){
        return(<div><p>The winner is Player {players["PlayerO"]}!</p><br /><button onClick={resetBoard}>Reset</button></div>);}
      }
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
     var playerBoard = ""
     if(players["PlayerX"]!="" && players["PlayerO"]=="" && players["Spectators"]==""){
       playerBoard = <div><h3>Player X</h3>{players["PlayerX"]}</div>;
     }
     else if (players["PlayerX"]!="" &&players["PlayerO"]!="" && players["Spectators"]==""){
       playerBoard = <div><h3>Player X</h3>{players["PlayerX"]} <h3>Player O</h3> {players["PlayerO"]}</div>;
     }
     else if(players["PlayerX"]!="" && players["PlayerO"]!="" && players["Spectators"]!=""){
       playerBoard = <div><h3>Player X</h3>{players["PlayerX"]} <h3>Player O</h3> {players["PlayerO"]}<h3>Spectators</h3>
      {players["Spectators"].map((item) => <p>{item} </p> )}</div>;
     }
    if(players["PlayerX"]!="" || players["PlayerO"]!="" || players["Spectators"]!=""){
      return (<div>
      {isLogged ? 
            <div>
            {playerBoard}
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
    </div>:null}</div>);
    }
    else{
      return;
    }
  }
  
  function resetBoard(){
    let boardCopy = ["","","","","","","","",""];
    setBoard(boardCopy);
    setX(true);
    socket.emit('resetBoard', {board: boardCopy, isX: true});
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
    socket.on('resetBoard', (data) =>{
      setBoard(data.board);
      setX(data.isX);
    });
  }, []);
  console.log(players);
    if(playerRef!=null){
      return (
      <div>
      <h1>Login</h1>
      <input ref={playerRef} type="text" placeholder = "Enter Username"  />
      <button onClick={onClickButton}>Submit</button>
      {displayPlayers()}
      </div>);
    }
    
}