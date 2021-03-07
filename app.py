import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv()) # This is to load your env variables from .env
app = Flask(__name__, static_folder="./build/static")
# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", json=json, manage_session=False)

@app.route("/", defaults={"filename": "index.html"})
@app.route("/<path:filename>")
def index(filename):
    return send_from_directory("./build", filename)
def calculateScores():
    all_people = models.Leaderboard.query.order_by(models.Leaderboard.score.desc()).all()
    print(all_people)
    users = []
    scores = []
    for person in all_people:
        users.append(person.username)
        scores.append(person.score)
    return users,scores
# When a client connects from this Socket connection, this function is run
@socketio.on("connect")
def on_connect():
    print("User connected!")

# When a client disconnects from this Socket connection, this function is run
@socketio.on("disconnect")
def on_disconnect():
    print("User disconnected!")

# When a client emits a change in the board to the server, this function is run
@socketio.on("board")
def on_chat(data):
    print(str(data))
    # This emits the 'board' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit("board", data, broadcast=True, include_self=False)

# when a client is able to log in, this function is run
@socketio.on("login")
def on_login(data):
    print(str(data))
    socketio.emit("login", data, broadcast=True, include_self=False)

# when a client tries to reset the board, this function is run
@socketio.on("resetBoard")
def on_resetBoard(data):
    print(str(data))
    socketio.emit("resetBoard", data, broadcast=True, include_self=False)
@socketio.on("winner")
def on_win(data):
    print(str(data))
    if(data['gameStat']['Winner']!="" and data['gameStat']['Loser']!=""):
        winner = db.session.query(models.Leaderboard).filter_by(username=data['gameStat']['Winner']).first()
        loser = db.session.query(models.Leaderboard).filter_by(username=data['gameStat']['Loser']).first()
        winner.score = winner.score + 1
        loser.score = loser.score - 1
        db.session.commit()
    users, scores = calculateScores()
    socketio.emit('leaderboard_info', {'users': users, 'scores':scores})
    #socketio.emit("winner", data, broadcast=True, include_self=False)
@socketio.on('join')
def on_join(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    if(models.Leaderboard.query.filter_by(username=data['user']).first() is None):
        new_user = models.Leaderboard(username=data['user'], score=100)
        db.session.add(new_user)
        db.session.commit()
    users, scores = calculateScores()
    socketio.emit('leaderboard_info', {'users': users, 'scores':scores})
# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    db.create_all()
    import models
# Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True,
    )