import logo from "./logo.svg";
import "./App.css";
import { Board } from "./Board.js";
import socket from "./Board.js";
import { Login } from "./Login.js";
import { Leaderboard } from "./Leaderboard.js";
import { useState, useRef, useEffect } from "react";

function App() {
  const [players, setPlayers] = useState({
    PlayerX: "",
    PlayerO: "",
    Spectators: [],
  }); // set empty dict to keep track of players
  const [currUser, setUser] = useState(""); //useState for the current username
  const playerRef = useRef(null); // references <input> element
  const [isLogged, setLog] = useState(false); //useState to check if user is logged in
  const [userList, setUserList] = useState([]);
  const [scoreList, setScoreList] = useState([]);
  const [isLeader, setLeader] = useState(false);
  function canLogIn(player) {
    if (player != "") {
      //if they entered something
      if (player == players["PlayerX"]) {
        //if they entered something that isn't the same as PlayerX
        return false;
      } else if (player == players["PlayerO"]) {
        //if they entered something that isn't the same as PlayerO
        return false;
      } else if (players["Spectators"].includes(player)) {
        //if they entered something that isn't the same as a spectator
        return false;
      }
      setLog(true);
      return true; //they can log in!
    } else {
      return false;
    }
  }
  function onClickLogin() {
    const player = playerRef.current.value;
    setUser(player);
    if (canLogIn(player)) {
      //if they can log in
      var playerCopy = { ...players };
      if (playerCopy["PlayerX"] != "" && playerCopy["PlayerO"] != "") {
        //if there's a playerX and O, they are a spectator
        playerCopy["Spectators"].push(player);
      } else if (playerCopy["PlayerX"] == "") {
        //if there is no playerX, set to playerX
        playerCopy["PlayerX"] = player;
      } else if (playerCopy["PlayerX"] != "" && playerCopy["PlayerO"] == "") {
        //if there is a playerX and no playerO, set to playerO
        playerCopy["PlayerO"] = player;
      }
      setPlayers(playerCopy);
      socket.emit("send_players", { players: playerCopy }); //send the dictionary over channel
      socket.emit("login", { user: player }); //send the user to add to database
    }
  }
  useEffect(() => {
    // listens for event emitted by server, if received, run code for corresponding channel
    socket.on("send_players", (data) => {
      console.log("Login event received!");
      console.log(data);
      var newPlayer = { ...data.players };
      setPlayers(newPlayer);
    });
    socket.on("leaderboard_info", (data) => {
      console.log("User list event received!");
      console.log(data);
      setUserList(data.users);
      setScoreList(data.scores);
    });
  }, []);
  return (
    <div>
      <center>
        {isLogged ? (
          <div class="flex-container">
            <div class="displayBoard">
              <Board
                players={players}
                currUser={currUser}
                playerRef={playerRef}
              />
              <br />
              <button class="lead" onClick={() => setLeader(!isLeader)}>
                Leaderboard
              </button>
              <div
                class={isLeader ? "displayLeaderboard" : "displayLeaderboard2"}
              >
                <Leaderboard
                  userList={userList}
                  scoreList={scoreList}
                  currUser={currUser}
                />
              </div>
            </div>
          </div>
        ) : (
          <Login playerRef={playerRef} onClickLogin={onClickLogin} />
        )}
      </center>
    </div>
  );
}

export default App;
