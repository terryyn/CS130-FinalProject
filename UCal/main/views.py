from . import main
from .. import db, db_manager
from ..model import User, Event
from flask import request

class Course:
    def __init__(self, course_name):
        self.course_name = course_name
    
    def getStudentsId(self):
        return db_manager.get_students(self.course_name)

@main.route('/', methods=['GET', 'POST']) 
def index():
    return 'To be integrated with frontend'

@main.route('/addEvent', methods=['GET', 'POST']) 
def add_event():
    eventID = db_manager.add_event_to_database(request.form)
    json_post = {
        'eventID': eventID
    }
    return json_post
    # return xx_template(json_post)

@main.route('/deleteEvent', methods=['GET', 'POST']) 
def delete_event():
    db_manager.delete_event_from_database(request.form['eventID'])
    return 'success'
    # return xx_template('success')

@main.route('/editEvent', methods=['GET', 'POST']) 
def edit_event():
    db_manager.edit_event_in_database(request.form['eventID'], request.form)
    return 'success'
    # return xx_template('success')

# get event by userid + date
@main.route('/getEventByUserAndDate', methods=['GET', 'POST']) 
def get_events_by_user_and_date():
    events_on_date = get_events_by_user(request.form)
    return events_on_date

# get event by eventID
@main.route('/getEventById', methods=['GET', 'POST']) 
def get_event_by_id():
    return Event.query.get(request.form['eventID'])

@main.route('/schedule-meeting', methods=['GET','POST']) 
def schedule_meeting(): 
    json_available_time = db_manager.find_available_meeting_time(request.form)
    return 'success'

@main.route('/add-meeting', methods=['GET','POST'])
def add_meeting():
    return 'success'