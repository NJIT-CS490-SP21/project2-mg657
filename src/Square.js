import React from 'react';
import './Square.css';
export function Square(props){
    return (<div class="box" onClick={() =>{props.onClickSquare(props.index)}}>{props.board[props.index]}</div>);
}