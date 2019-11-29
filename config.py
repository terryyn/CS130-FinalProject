# This file is flake8 linter compatible
import os
cur_dir = os.path.abspath(os.path.dirname(__file__))


class BasicConfig:
    '''
    The basic config class for which specific configs for different situations
    inherit from.
    '''
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_RECORD_QUERIES = True
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'

    '''
    Abstract init_app to be implemented by certain children classes
    '''
    @staticmethod
    def init_app(app):
        pass


class DevConfig(BasicConfig):
    '''
    Config class to be used for development
    '''
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///' + os.path.join(cur_dir, 'data-dev.sqlite')


class TestConfig(BasicConfig):
    '''
    Config class to be used for testing
    '''
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'sqlite://'


class ProdConfig(BasicConfig):
    '''
    Config class to be used for production
    '''
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(cur_dir, 'data.sqlite')

    @classmethod
    def init_app(cls, app):
        BasicConfig.init_app(app)


config = {
    'dev': DevConfig,
    'test': TestConfig,
    'production': ProdConfig
}