# flake8 compatible
import os
from flask import Flask
from flask_login import UserMixin, AnonymousUserMixin
from . import db


class User(db.Model):
    '''
    The user table contains the following columns:
    id | username | email | password_hash | is_instructor
    '''
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index = True)
    email = db.Column(db.String(128), unique=True, index = True)
    password_hash = db.Column(db.String(128))
    is_instructor = db.Column(db.Boolean)
    participations = db.relationship(
        'Participation', backref='user', lazy='dynamic'
    )


class EventType:
    '''
    The EventType class serves an enumeration indicating the
    type of event as a field in event entries
    '''
    DEFAULT = 0
    COURSE = 1
    MEETING = 2
    EXAM = 3
    ASSIGNMENT = 4


class Event(db.Model):
    '''
    The event table contains the following columns:
    id | name | startdate | starttime | location | eventType |
    endtime | enddate | description | participations(meeting)
    '''
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    startdate = db.Column(db.Date)
    starttime = db.Column(db.Time)
    location = db.Column(db.String(64))
    eventType = db.Column(db.Integer, default=EventType.DEFAULT)
    enddate = db.Column(db.Date)
    endtime = db.Column(db.Time)
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
