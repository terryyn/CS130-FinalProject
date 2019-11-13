from flask_login import UserMixin, AnonymousUserMixin
from . import db, login_manager

class User(UserMixin, db.Model):
    '''
    table users
    id | username | email | password_hash | is_instructor
    
    '''
    __table_name__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index = True)
    email = db.Column(db.String(128), unique=True, index = True)
    password_hash = db.Column(db.String(128))
    participations = db.relationship('Participation', backref= 'user', lazy = 'dynamic')

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

class EventType:
    DEFAULT = 0
    COURSE = 1
    MEETING = 2
    EXAM = 3
    ASSIGNMENT = 4

class Event(db.Model):
    '''
    event table:

    id  | eventName |  date  |  time  |  location  |  description  |  eventType

    '''
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    eventName = db.Column(db.String(64))
    # userID = db.Column(db.Integer, db.ForeignKey('users.id'))
    date = db.Column(db.Date)
    time = db.Column(db.Time)
    location = db.Column(db.String(64))
    description = db.Column(db.String(64), nullable=True)
    eventType = db.Column(db.Integer, default=EventType.DEFAULT)
    participations = db.relationship('Participation', backref= 'event', lazy = 'dynamic')

class Participation(db.Model):
    '''
    participation table
    event_id | user_id 

    '''
    __tablename__ = 'participation'
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
