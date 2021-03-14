import React from 'react';
import PropTypes from 'prop-types';
import './Login.css';

export function Login(props) {
  const { playerRef, onClickLogin } = props;
  return (
    <div>
      <h1 className="login"> Login To Play! </h1>
      <input
        ref={playerRef}
        type="text"
        placeholder="Enter Username"
      />
      {' '}
      <br />
      <br />
      <button
        type="button"
        className="submit"
        onClick={() => {
          onClickLogin();
        }}
      >
        {' '}
        Login
        {' '}
      </button>
      {' '}
    </div>
  );
}
Login.propTypes = {
  playerRef: PropTypes.string.isRequired,
  onClickLogin: PropTypes.func.isRequired,
};
export default Login;
