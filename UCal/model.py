# flake8 compatible
import os
from flask import Flask
from flask_login import UserMixin
from . import db


class User(UserMixin, db.Model):
    '''
    The user table contains the following columns:
    id | username | email | password_hash | is_instructor
    '''
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index = True)
    email = db.Column(db.String(128), unique=True, index = True)
    password_hash = db.Column(db.String(128))
    is_instructor = db.Column(db.Boolean)
    courses =  db.Column(db.String(1024), default='')
    notifications =  db.Column(db.String(1024), default='')
    participations = db.relationship(
        'Participation', backref='user', lazy='dynamic'
    )

    def is_authenticated(self):
        return True


class EventType:
    '''
    The EventType class serves an enumeration indicating the
    type of event as a field in event entries
    '''
    DEFAULT = 0
    COURSE = 1
    DISCUSSION = 2
    OH = 3
    EXAM = 4
    DEADLINE = 5
    MEETING = 6
    MEETING_TENTATIVE = 7

class FrequencyType:
    '''
    The FrequencyType class serves as an enumeration indicating the
    frequency of event as a field in event entries 
    '''
    DEFAULT = 0
    DAILY = 1
    WEEKLY = 2
    MONTHLY = 3

class Event(db.Model):
    '''
    The event table contains the following columns:
    id | name | startdate | starttime | location | eventType |
    endtime | enddate | frequencyType | description | course | guests

    A course type event should has the course field as the name of itself

    '''
    __tablename__ = 'events'
    def as_dict(self):
       return {'id': self.id,
               'name': self.name,
               'startdate': str(self.startdate),
               'starttime': str(self.starttime),
               'enddate': str(self.enddate),
               'endtime': str(self.endtime),
               'location': self.location,
               'eventType': self.eventType,
               'frequencyType': self.frequencyType,
               'description': self.description,
               'course': self.course,
               'guests': self.guests}
       
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    course = db.Column(db.String(64), default=None)
    guests = db.Column(db.String(), default=None)
    startdate = db.Column(db.Date)
    starttime = db.Column(db.Time)
    location = db.Column(db.String(64))
    eventType = db.Column(db.Integer, default=EventType.DEFAULT)
    enddate = db.Column(db.Date)
    endtime = db.Column(db.Time)
    frequencyType = db.Column(db.Integer, default=FrequencyType.DEFAULT)
    description = db.Column(db.String(64), nullable=True)
    participations = db.relationship(
        'Participation', backref='event', lazy='dynamic'
    )


class Participation(db.Model):
    '''
    The participation table indicates the relationship between
    an event and a user, and contains the following columns:
    event_id | user_id
    '''
    __tablename__ = 'participation'
    event_id = db.Column(
        db.Integer, db.ForeignKey('events.id'), primary_key=True
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey('users.id'), primary_key=True
    )
