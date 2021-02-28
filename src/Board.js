import React from 'react';
import './Board.css';
import {useState, useRef, useEffect} from 'react';
import {calculateWinner,isBoardFull} from './IsWinner.js';
import {Square} from './Square.js';
import io from 'socket.io-client';
const socket = io(); // Connects to socket connection
export function Board() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]); //sets board to empty array
  const [isX, setX] = useState(true); //useState for who's turn it is
  const [players, setPlayers] = useState({"PlayerX": "","PlayerO": "","Spectators": []}); // set empty dict to keep track of players
  const playerRef = useRef(null); // references <input> element
  const [isLogged, setLog] = useState(false); //useState to check if user is logged in

  function onClickSquare(index) {
    if (canClickBoard()) { //if they're allowed to play
      let newBoard = [...board];
      if (newBoard[index] == "") { //if the board value has not been assigned yet
        newBoard[index] = isX ? "X" : "O";
        setBoard(newBoard);
        setX(!isX);
        socket.emit('board', {board: newBoard[index],index: index,isX: isX}); //send updated board, updated turn and index
      }
    }
  }

  function canClickBoard() {
    const currUser = playerRef.current.value;
    if (players["Spectators"].includes(currUser)) { //if they are a spectator, can't click board
      return false;
    }
    if (displayWinner(board)) { //once there is a winner, can't click board
      return false;
    }
    if (players["PlayerX"] != "" && players["PlayerO"] != "") { //only if there are two players logged in
      if ((isX && currUser == players["PlayerX"]) || (!isX && currUser == players["PlayerO"])) { //and it is current users turn, can click board
        return true;
      }
    }
  }

  function onClickSubmit() {
    if (playerRef != null) { //if they have entered a user
      setLog(true);
      const player = playerRef.current.value;
      var playerCopy = {...players};
      if (playerCopy["PlayerX"] != "" && playerCopy["PlayerO"] != "") { //if there's a playerX and O, they are a spectator
        playerCopy["Spectators"].push(player);} 
      else if (playerCopy["PlayerX"] == "") { //if there is no playerX, set to playerX
        playerCopy["PlayerX"] = player;} 
      else if (playerCopy["PlayerX"] != "" && playerCopy["PlayerO"] == "") { //if there is a playerX and no playerO, set to playerO
        playerCopy["PlayerO"] = player;}
      setPlayers(playerCopy);
      socket.emit('login', {players: playerCopy}); //send the dictionary over channel
    }
  }


  function displayWinner(board) {
    var winner = "";
    if (isBoardFull(board) && !calculateWinner(board)) { //if it is a full board and no winner, it is a draw
      winner = <div><p> It is a draw </p><br/> </div>;
    } 
    else if (calculateWinner(board)) { //if there is a winner
      if (calculateWinner(board) == "X") { //if the winner is player X, display message
        winner = <div> <p> The winner is {players["PlayerX"]}!</p><br/></div>; 
      }
      if (calculateWinner(board) == "O") { //if the winner is player O, display message
        winner=<div><p>The winner is {players["PlayerO"]}!</p><br/></div>;}
    }
    if(winner){ //only display play again button if there is a winner or draw
      return(<div class="players">{winner}<button class = "again" onClick = {resetBoard}>Play Again</button></div>);
    }
  }

  function resetBoard() {
    let boardCopy = ["", "", "", "", "", "", "", "", ""]; //reset the board
    setBoard(boardCopy);
    setX(true); //player X always goes first
    socket.emit('resetBoard', {board: boardCopy,isX: true});
  }
  useEffect(() => {// Listening for an event emitted by server. If received, we
              // run the code in the function that is passed in as the second arg
    socket.on('board', (data) => {
      console.log('Board event received!');
      setBoard(prevBoard => {
      let newBoard = [...prevBoard];
      newBoard[data.index] = data.isX ? "X" : "O";
      setX(!data.isX);
      return (newBoard)});
      console.log(data);});
    socket.on('login', (data) => {
      console.log('Login event received!');
      var newPlayer = {...data.players};
      setPlayers(newPlayer);});
    socket.on('resetBoard', (data) => {
      setBoard(data.board);
      setX(data.isX);});
    }, []);

  function displayPlayers() {
    var playerBoardX = "";
    var playerBoardO = "";
    var playerBoardSpect = "";
    if (players["PlayerX"] != "") { //only shows users who have logged in 
      playerBoardX = <div> <p> Player X: {players["PlayerX"]}</p></div >;
      if (players["PlayerO"] != "") {
        playerBoardO = <div> <p>Player O: {players["PlayerO"]}</p> </div>;
        if (players["Spectators"] != "") {
          playerBoardSpect = <div> <p>Spectators: {players["Spectators"].map((item) => <div>{item}</div> )}</p></div >;}
    }
      
    }
    if (players["PlayerX"] != "" || players["PlayerO"] != "" || players["Spectators"] != "") {
        return (<div> {isLogged ?
                  <div> 
                  <div class = "players">
                  <br/>
                  Welcome to Tic Tac Toe <b>{playerRef.current.value}</b>
                  
                  {playerBoardX}{playerBoardO}{playerBoardSpect} 
                  {isX ? 
                      <p> Player {players["PlayerX"]}'s turn</p>:
                      <p>Player {players["PlayerO"]}'s turn </p>} 
                  </div>
                  </div>:null}
                </div>);
      }
      //else {return;}
      }
    console.log(players);
    if (playerRef != null) {
      return ( <div><h1 class ="login"> Login </h1>
      <input ref = {playerRef} type = "text" placeholder = "Enter Username" /> <br/><br/>
      <button class = "submit" onClick = {onClickSubmit}> Submit </button> {displayPlayers()} 
      {isLogged?
      <div>
      <div class = "board">
        <Square onClickSquare={onClickSquare} board={board} index={0} />
        <Square onClickSquare={onClickSquare} board={board} index={1} />
        <Square onClickSquare={onClickSquare} board={board} index={2} />
        <Square onClickSquare={onClickSquare} board={board} index={3} />
        <Square onClickSquare={onClickSquare} board={board} index={4} />
        <Square onClickSquare={onClickSquare} board={board} index={5} />
        <Square onClickSquare={onClickSquare} board={board} index={6} />
        <Square onClickSquare={onClickSquare} board={board} index={7} />
        <Square onClickSquare={onClickSquare} board={board} index={8} /> 
      </div>{displayWinner(board)}</div>:null}
      </div>);
    }}