from flask import Flask
from .config import Config
from .extensions import db, jwt
from flask_cors import CORS

from .routes.auth import auth_bp
from .routes.admin import admin_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)

    return app