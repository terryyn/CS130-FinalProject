import datetime
import unittest
from unittest.mock import Mock, patch
import json
from UCal import create_app, db, db_manager
from UCal.model import User, Event, EventType, Participation

def get_meeting_json():
    return {
        'meeting_name' : 'CS130 Discussion', 
        'participants' : ['Joe Bruin','Josephine Bruin'], 
        'possible_days': [datetime.datetime(2019,12,10),datetime.datetime(2019,12,13)],
        'meet_duration': 60,
        'earliest_meet_time': datetime.time(hour=9,minute=30),
        'latest_meet_time': datetime.time(hour=19,minute=0)
    }

def get_user1_info():
    return {
        'username': 'Joe Bruin',
        'email' : 'joebruin@ucal.com',
        'password' : 'password',
        'is_instructor' : False
    }

def get_user2_info():
    return {
        'username': 'Josephine Bruin',
        'email' : 'josbruin@ucal.com',
        'password' : 'drowssap',
        'is_instructor' : False
    }

def get_event_info():
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

class DBManagerIntegrationTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('test')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def testAddUserLogin(self):
        user1_info = get_user1_info()
        user2_info = get_user2_info()
        addSuccess1 = db_manager.add_user(user1_info)
        addSuccess2 = db_manager.add_user(user2_info)
        assert addSuccess1 and addSuccess2
        user1 = db_manager.log_in(user1_info)
        assert user1 != None
        user2_info['password'] = 'password'
        user2 = db_manager.log_in(user2_info)
        assert user2 == None

    def testAddEditDeleteEvent(self):
        user1_info = get_user1_info()
        user2_info = get_user2_info()
        db_manager.add_user(user1_info)
        db_manager.add_user(user2_info)
        event1_info = get_event_info()
        event_id = db_manager.add_event_to_database(event1_info)
        assert event_id != None

    def testFindMeetingTime(self):
        user1_info = get_user1_info()
        user2_info = get_user2_info()
        db_manager.add_user(user1_info)
        db_manager.add_user(user2_info)
        event1_info = get_event_info()
        event_id = db_manager.add_event_to_database(event1_info)
        event2_info = get_event_info()
        event2_info['name'] = user2_info['username']
        event2_info['starttime'] = '14:30'
        event2_info['endtime'] = '18:30'
        db_manager.add_event_to_database(event1_info)
        db_manager.add_event_to_database(event2_info)
        time_slots = db_manager.find_available_meeting_time(get_meeting_json())
        assert time_slots != None