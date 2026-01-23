from app import create_app

app = create_app()

from app.extensions import db

with app.app_context():
    db.create_all()     # Generates tables inside schema

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True) #0.0.0.0 Flask listens on all network interfaces (inside container + exposed to host via Docker port mapping)
