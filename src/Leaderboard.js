import React from 'react';
import './Leaderboard.css';
export function Leaderboard(props){
    const renderTable = props.userList.map((user, index) =>{
        const scores = props.scoreList[index];
        var tdUser = "";
        var tdScore = "";
        if(props.currUser == user){
            tdUser = <td><b>{user}</b></td>;
            tdScore = <td><b>{scores}</b></td>;
        }
        else{
            tdUser = <td>{user}</td>;
            tdScore = <td>{scores}</td>;
        }
        return(
            <tr>{tdUser}{tdScore}</tr>);
        
    });
    return(
    <div>
    <h2>Leaderboard</h2> 
    <table id="t01">
    <thead>
        <tr>
            <th>User</th>
            <th>Score</th>
        </tr>
    </thead>
    <tbody>
        {renderTable}
    </tbody>
</table>
</div>);
}