from flask import Flask
from .config import Config
from .extensions import db, jwt, socketio
from flask_cors import CORS
import cloudinary



from .routes.auth import auth_bp
from .routes.admin import admin_bp
from .routes.user import user_bp
from .routes.quizzes import quizzes_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    cloudinary.config(
        cloud_name=Config.CLOUDINARY_CLOUD_NAME,
        api_key=Config.CLOUDINARY_API_KEY,
        api_secret=Config.CLOUDINARY_API_SECRET
    )

    CORS(
        app,
        origins=["http://localhost:5173"],
        supports_credentials=True,
    )


    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")

    
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(quizzes_bp)


    return app
