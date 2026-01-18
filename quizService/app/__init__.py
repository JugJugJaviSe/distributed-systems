from flask import Flask
from .config import Config
from .extensions import db, jwt
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        origins=["http://localhost:5173"],
        supports_credentials=True,
    )


    db.init_app(app)
    jwt.init_app(app)

    return app
