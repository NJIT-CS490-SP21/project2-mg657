import logo from './logo.svg';
import './App.css';
import { Board } from './Board.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [players, setPlayers] = useState([]); // State variable, list of players
  const playerRef = useRef(null); // Reference to <input> element
  function onClickButton() {
    if (playerRef != null) {
      const player = playerRef.current.value;
      setPlayers(oldPlayer => [...oldPlayer, player]);
      const playerX = players[0];
      const playerY = players[1];
      const spectators = players.slice(2);
      if(players.length==1){
        socket.emit('login', {player: player, players: players, playerX:playerX});
      }
      else if(players.length==2){
        socket.emit('login', {player: player, players: players, playerX:playerX, playerY:playerY});
      }
      else if(players.length>2){
        socket.emit('login', {player: player, players: players, playerX:playerX, playerY:playerY, spectators:spectators});
      }
      else{
        socket.emit('login', {player: player, players: players});
      }
      
    }
  }
  useEffect(() => {
    socket.on('login', (data) => {
      console.log('Login event received!');
      setPlayers(oldPlayer => [...oldPlayer, data.player]);
      console.log(data);
      });
  }, []);

  return (
    <div>
      <h1>Login Info</h1>
      Enter username: <input ref={playerRef} type="text" />
      <button onClick={onClickButton}>Submit</button>
      {players.map((player) => <li>{player}</li>)}
     
      <Board />
    </div>
  );
}

export default App;