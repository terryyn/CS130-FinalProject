from flask_login import UserMixin, AnonymousUserMixin
from . import db, login_manager

class User(UserMixin, db.Model):
    '''
    table users
    user_id | user_name | email | password | is_instructor
    
    '''
    __table_name__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(64), unique=True, index = True)
    email = db.Column(db.String(128), unique=True, index = True)
    password_hash = db.Column(db.String(128))

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

    id  |  eventName  |  userID  |  date  |  time  |  location  |  description  |  eventType  |  participantsID

    '''
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    eventName = db.Column(db.String(64))
    userID = db.Column(db.Integer)
    date = db.Column(db.Date)
    time = db.Column(db.Time)
    location = db.Column(db.String(64))
    description = db.Column(db.String(64), nullable=True)
    eventType = db.Column(db.Integer, default=EventType.DEFAULT)
    participants = db.Column(db.PickleType, nullable=True)

    @staticmethod
    def add_event(event_json):
        new_event = Event(eventName=event_json[eventName], userID=event_json[userID], date=event_json[date], time=event_json[time], location=event_json[location], description=event_json[description], eventType=event_json[eventType], participants=event_json[participants])
        db.session.add(new_event)
        db.session.commit()