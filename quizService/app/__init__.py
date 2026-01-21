from flask import Flask
from .config import Config
from .extensions import db, jwt
from flask_cors import CORS

from app.routes.quiz import quiz_bp
from app.routes.quiz_execution import quiz_execution_bp
from app.routes.quiz_mail import quiz_mail_bp

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

    app.register_blueprint(quiz_bp)
    app.register_blueprint(quiz_execution_bp)
    app.register_blueprint(quiz_mail_bp)

    return app
