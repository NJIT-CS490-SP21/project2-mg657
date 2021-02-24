import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import {Board} from './Board.js';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [messages, setMessages] = useState([]); // State variable, list of messages
  return (
    <div>
      <Board />
    </div>
  );
}

export default App;