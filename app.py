import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder="./build/static")
cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", json=json, manage_session=False)


@app.route("/", defaults={"filename": "index.html"})
@app.route("/<path:filename>")
def index(filename):
    return send_from_directory("./build", filename)

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

# this will run the application
socketio.run(
    app,
    host=os.getenv("IP", "0.0.0.0"),
    port=8081 if os.getenv("C9_PORT") else int(os.getenv("PORT", 8081)),
    debug=True,
)
