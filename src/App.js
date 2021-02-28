import logo from './logo.svg';
import './App.css';
import { Board } from './Board.js';
import { useState, useRef, useEffect } from 'react';

import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  return (
    <div>
    <center>
      <Board />
    </center>
    </div>
  );
}

export default App;