import React from "react";
import "./Leaderboard.css";
export function Leaderboard(props) {
  const renderTable = props.userList.map((user, index) => {
    const scores = props.scoreList[index];
    var tRow = "";
    if (props.currUser == user) {
      tRow = "curr";
    } else {
      tRow = "";
    }
    return (
      <tr class={tRow}>
        <td>{user}</td>
        <td>{scores}</td>
      </tr>
    );
  });
  return (
    <div>
      <h2>Leaderboard</h2>
      <table id="t01">
        <thead>
          <tr>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>{renderTable}</tbody>
      </table>
    </div>
  );
}
