import React from 'react';
import './Login.css';
export function Login(props){
return (
      <div><h1 class ="login"> Login To Play! </h1>
      <input ref = {props.playerRef} type = "text" placeholder = "Enter Username" /> <br/><br/>
      <button class = "submit" onClick={() =>{props.onClickLogin()}}> Login </button> </div>);
    }