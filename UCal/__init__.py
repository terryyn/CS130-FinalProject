from config import config

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
db = SQLAlchemy()

from .dbmanager import DatabaseManager
db_manager = DatabaseManager.getInstance()

def create_app(config_name='dev'):
    # create and configure the app
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    CORS(app)
    db.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app