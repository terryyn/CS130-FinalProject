import datetime
import unittest
from unittest.mock import Mock, patch
import json
from UCal import create_app, db
from UCal.dbmanager import DatabaseManager
from UCal.model import User, Event, EventType, Participation
from flask_sqlalchemy import SQLAlchemy

def get_event_json():
    return {
        'name' : 'Joe Bruin',
        'startdate' : '2019-12-13',
        'starttime' : '11:30',
        'enddate' : '2019-12-13',
        'endtime' : '14:30',
        'location' : 'Boelter 3400',
        'type' : EventType.EXAM,
        'description' : 'This is the final exam for CS130 Fall 2019'
    }

class DBMangaerTestCase(unittest.TestCase):
    def setUp(self):
        pass
    
    def tearDown(self):
        pass
    
    def test_read_event_json(self):
        db_manager = DatabaseManager.getInstance()
        event_object = db_manager.read_event_json(get_event_json())
        assert event_object != None

