import React from 'react';
export function Leaderboard(props){
    return(
    <div>
    <table>
    <thead>
        <tr>
            <th colspan="2">Leaderboard</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            {props.userList.map((user) => <td>{user}</td>)}
        </tr>
        <tr>
            {props.scoreList.map((score) => <td>{score}</td>)}
        </tr>
    </tbody>
</table>


</div>);
}