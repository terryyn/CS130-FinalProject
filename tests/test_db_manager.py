from datetime import date, time
import unittest
from unittest.mock import Mock, patch
import json
from UCal import create_app, db, db_manager
from UCal.model import User, Event, EventType, Participation

def get_event_json():
    return json.dump({
        'name' : 'Joe Bruin',
        'startdate' : '2019-12-13',
        'start_time' : '11:30',
        'end_date' : '2019-12-13',
        'end_time' : '14:30',
        'location' : 'Boelter 3400',
        'eventType' : EventType.exam,
        'description' : 'This is the final exam for CS130 Fall 2019'
    })

def get_event_object():
    startdate = date(2019, 12, 13)
    starttime = time(11, 30)
    enddate = date(2019, 12, 13)
    endtime = time(14, 30)
    return Event(
        name='Joe Bruin', 
        startdate=startdate,
        starttime=starttime,
        enddate=enddate,
        endtime=endtime,
        location='Boelter 3400',
        EventType=EventType.exam,
        description='This is the final exam for CS130 Fall 2019'
        )

def mock_add_function(json_str):
    pass

def mock_commit_function():
    pass

def get_json_entry(json_str, column):
    return json_str[column]

class DBMangaerTestCase(unittest.TestCase):
    def setUp(self):
        self.addpatcher = patch('db.session.add')
        self.commitpatcher = patch('db.session.commit')
    
    def tearDown(self):
        self.addpatcher.stop()
        self.commitpatcher.stop()
    
    def test_add_event(self):
        with Mock(spec=mock_add_function) as mock:
            db_manager.add_event_to_database(get_event_json())
            mock.assert_called_once_with(get_event_object())


