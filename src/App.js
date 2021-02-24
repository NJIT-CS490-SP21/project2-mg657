import logo from './logo.svg';
import './App.css';
import {Board} from './Board.js';
import {useState, useRef } from 'react';
function App() {
  
  const [myList,changeList] = useState([]);
  const inputRef = useRef(null);
  return (
    <div>
    <Board/>
    </div>
  );
  
}

export default App;
