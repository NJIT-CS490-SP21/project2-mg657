import React from 'react';
import PropTypes from 'prop-types';
import './Leaderboard.css';

export function Leaderboard(props) {
  const { userList, scoreList, currUser } = props;
  const renderTable = userList.map((user, index) => {
    const scores = scoreList[index];
    let tRow = '';
    if (currUser === user) {
      tRow = 'curr';
    } else {
      tRow = '';
    }
    return (
      <tr className={tRow}>
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

Leaderboard.propTypes = {
  currUser: PropTypes.string.isRequired,
  userList: PropTypes.arrayOf(PropTypes.string).isRequired,
  scoreList: PropTypes.arrayOf(PropTypes.number).isRequired,
};
export default Leaderboard;
