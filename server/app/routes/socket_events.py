from flask_socketio import join_room
from app.extensions import socketio

@socketio.on("join")
def handle_join(room):
    print("JOIN ROOM:", room)
    join_room(room)
