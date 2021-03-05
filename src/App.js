import logo from './logo.svg';
import './App.css';
import { Board } from './Board.js';
import {Login} from './Login.js';

import { useState, useRef, useEffect } from 'react';

import io from 'socket.io-client';

const socket = io(); // Connects to socket connection


function App() {
const [players, setPlayers] = useState({"PlayerX": "","PlayerO": "","Spectators": []}); // set empty dict to keep track of players
const [currUser, setUser] = useState(""); //useState for the current username
const playerRef = useRef(null); // references <input> element
const [isLogged, setLog] = useState(false); //useState to check if user is logged in

  function canLogIn(player){
    if(player!=""){ //if they entered something
      if(player==players["PlayerX"]){ //if they entered something that isn't the same as PlayerX
        return false;
      }
      else if(player==players["PlayerO"]){ //if they entered something that isn't the same as PlayerO
        return false;
      }
      else if (players["Spectators"].includes(player)){ //if they entered something that isn't the same as a spectator
        return false;
      }
      setLog(true);
      return true; //they can log in!
    }
    else{
      return false;
    }
    
  }
  function onClickLogin() {
    const player = playerRef.current.value;
    setUser(player);
    if (canLogIn(player)) { //if they can log in
      
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
  useEffect(() => {// listens for event emitted by server, if received, run code for corresponding channel
    socket.on('login', (data) => {
      console.log('Login event received!');
      var newPlayer = {...data.players};
      setPlayers(newPlayer);
    });
    
    }, []);
  return (
    <div>
    <center>
    {isLogged?<Board players={players} currUser={currUser} playerRef={playerRef}/>:<Login playerRef={playerRef} onClickLogin={onClickLogin}/>}
    </center>
    </div>
  );
}

export default App;