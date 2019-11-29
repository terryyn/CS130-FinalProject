import datetime
import unittest
from unittest.mock import Mock, patch
import json
from UCal import create_app, db, db_manager
from UCal.model import User, Event, EventType, Participation
from UCal.roomfinder import RoomFinder
from datetime import datetime, date, time, timedelta

def get_meeting_json():
    return {
        'meeting_name' : 'CS130 Discussion', 
        'participants' : ['Joe Bruin','Josephine Bruin'], 
        'possible_days': [datetime.datetime(2019,12,10),datetime.datetime(2019,12,13)],
        'meet_duration': 60,
        'earliest_meet_time': datetime.time(hour=9,minute=30),
        'latest_meet_time': datetime.time(hour=19,minute=0)
    }

class findStudyRoomTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('test')
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.finder = RoomFinder()
        db.create_all()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def testFindAtLeastOneStudyRoom(self):
        starttime = datetime(year=2019, month=11, day=28, hour=14)
        endtime = datetime(year=2019, month=11, day=28, hour=17)
        studyRoom = self.finder.find_room(5, [(starttime, endtime)], 1)
        assert studyRoom!= None