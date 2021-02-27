import logo from './logo.svg';
import './App.css';
import { Board } from './Board.js';
import { useState, useRef, useEffect } from 'react';

import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [players, setPlayers] = useState({"PlayerX":"", "PlayerO": "", "Spectators": []}); // State variable, list of players
  const playerRef = useRef(null); // Reference to <input> element
  function onClickButton() {
    if (playerRef != null) {
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
      //console.log(playerCopy);
      socket.emit('login', {players: playerCopy});
    }
  }
  useEffect(() => {
    socket.on('login', (data) => {
      console.log('Login event received!');
      var newPlayer = {...data.players}
      setPlayers(newPlayer);
      });
  }, []);
  console.log(players);
  return (
    <div>
      <h1>Login Here</h1>
      Enter username: <input ref={playerRef} type="text" />
      <button onClick={onClickButton}>Submit</button>
      <ul>
      <li>Player X: {players["PlayerX"]}</li>
      <li>Player O: {players["PlayerO"]}</li>
      {players["Spectators"].map((item) => <li>Spectators: {item} </li> )}
      </ul>
      
     
      <Board />
    </div>
  );
}

export default App;