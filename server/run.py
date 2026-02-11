import os
from app import create_app
from app.extensions import socketio, db
#comment for testing workflow
app = create_app()


if os.getenv("AUTO_CREATE_TABLES", "false").lower() == "true":
    with app.app_context():
        db.create_all()

if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        debug=True,
        allow_unsafe_werkzeug=True,
    )
