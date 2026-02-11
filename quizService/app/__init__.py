from flask import Flask
from .config import Config
from .extensions import db, jwt
from flask_cors import CORS

from app.routes.quiz import quiz_bp
from app.routes.quiz_execution import quiz_execution_bp
from app.routes.quiz_mail import quiz_mail_bp
from app.routes.quiz_admin import quiz_admin_bp
from app.routes.quiz_moderator import quiz_moderator_bp
from app.routes.quiz_leaderboard import quiz_leaderboard_bp

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
    app.register_blueprint(quiz_admin_bp)
    app.register_blueprint(quiz_moderator_bp)
    app.register_blueprint(quiz_leaderboard_bp)

    return app
