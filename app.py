"""
This file handles all the socket listeners 
"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())  # This is to load your env variables from .env
app = Flask(
    __name__,
    static_folder="./build/static")  # Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL')  # Gets rid of warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
import models
cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@app.route("/", defaults={"filename": "index.html"})
@app.route("/<path:filename>")
def index(filename):
    """
    Sends the file from the build directory
    """
    return send_from_directory("./build", filename)


def calculate_scores():
    """
    This orders all the of the scores from highest to lowest,
    creates two lists with users and scores
    """
    all_people = models.Leaderboard.query.order_by(
        models.Leaderboard.score.desc()).all()
    print(all_people)
    users = []
    scores = []
    for person in all_people:
        users.append(person.username)
        scores.append(person.score)
    return users, scores


@socketio.on("connect")
def on_connect():
    """
    When a client connects from this Socket connection, this function is run
    """
    print("User connected!")


@socketio.on("disconnect")
def on_disconnect():
    """
    When a client disconnects from this Socket connection, this function is run
    """
    print("User disconnected!")


@socketio.on("board")
def on_board(data):
    """
    When a client emits a change in the board to the server, this function is run
    The 'board' event is emitted from the server to all the clients except for
    the client that emmitted the event that triggered this function
    """
    printData(data)
    socketio.emit("board", data, broadcast=True, include_self=False)
    return data
def printData(data):
    print(str(data))
    return data

@socketio.on("send_players")
def on_login(data):
    """
    When client logs in, this function is run
    The updated dictionary of players and spectators is sent
    """
    printData(data)
    socketio.emit("send_players", data, broadcast=True, include_self=False)
    


@socketio.on("resetBoard")
def on_reset_board(data):
    """
    When a client tries to reset the board, this function is run
    The empty board is sent back
    """
    printData(data)
    socketio.emit("resetBoard", data, broadcast=True, include_self=False)
    

def updateScore(score, role):
    """
    This updates the score based on weather the user won or lost
    """
    if role == 'winner':
        return score+1
    if role == 'loser':
        return score-1
def update_score_db(win, lost):
    leaderboard = {win: "", lost: ""}
    if (win!= "" and lost != ""):
        winner = db.session.query(
            models.Leaderboard).filter_by(username=win).first()
        loser = db.session.query(
            models.Leaderboard).filter_by(username=lost).first()
        winner.score = updateScore(winner.score, 'winner')
        loser.score = updateScore(loser.score, 'loser')
        db.session.commit()
        leaderboard[win] = winner.score
        leaderboard[lost] = loser.score
    return leaderboard
@socketio.on("winner")
def on_win(data):
    """
    When there is a winner, this function is run
    One point is added to the winner's score
    One point is deducted from the loser's score
    This change is committed to the database and the updated lists are sent back
    """
    print(str(data))
    update_score_db(data['winner'], data['loser'])
    users, scores = calculate_scores()
    socketio.emit('leaderboard_info', {'users': users, 'scores': scores})

def userExists(user):
    """
    Checks if the user is in the database
    """
    if models.Leaderboard.query.filter_by(username=user).first() is None:
        return True
    return False
def add_user(user):
    """
    Adds user to database
    """
    new_user = models.Leaderboard(username=user, score=100)
    db.session.add(new_user)
    db.session.commit()
    all_people = models.Leaderboard.query.all()
    users = []
    for person in all_people:
        users.append(person.username)
    return users
@socketio.on('login')
def on_join(data):
    """
    When a user logs in, this function is run
    If they are a new user, their username is added to the database and their score is set to 100
    The updated lists are sent back
    """
    print(str(data))
    if userExists(data['user']):
        add_user(data['user'])
    users, scores = calculate_scores()
    socketio.emit('leaderboard_info', {'users': users, 'scores': scores})


# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    db.create_all()
    # To run, socketio.run is called with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True,
    )
