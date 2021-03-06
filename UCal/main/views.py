from . import main
from .. import db_manager
from ..roomfinder import RoomFinder
from flask import request, redirect, render_template
from flask_login import login_required
import json

class Course:
    '''
    A Course object represents a course indicated by course_name.
    Has one member variable and one member function.
    '''
    def __init__(self, course_name):
        self.course_name = course_name

    def getStudentsId(self):
        '''
        Returns the list of students enrolled in this course.
        '''
        return db_manager.get_students(self.course_name)

@main.route('/', methods=['GET', 'POST']) 
def index():
    return 'To be integrated with frontend'

@main.route('/signUp', methods=['GET','POST']) 
def sign_up():
    if request.method == 'POST':
        new_user = db_manager.add_user(request.get_json(force=True))
        if new_user:
            return "user added"
        else:
            return "current user"
    return "invalid method"

@main.route('/logIn', methods=['GET','POST']) 
# -1: Not current user
# -2: Wrong password
# -3: Unknown error
def log_in():
    if request.method == 'POST':
        user_info = db_manager.log_in(request.get_json(force=True))
        if user_info == -1:
            return "new user"
        elif user_info == -2:
            return "incorrect password"
        elif user_info == -3:
            return "unknown error"
        else:
            return user_info
    return "invalid method"

@main.route('/auth', methods=['GET']) 
def auth():
    print (request.cookies)
    if request.method == 'GET':
        user_info = db_manager.auth()
        if (user_info is not None):
            return user_info
        else:
            return "fail"
    return "invalid method"

@main.route('/logOut')
@login_required
def logout():
    db_manager.logout()
    return "success"

@main.route('/getName', methods=['GET'])
@login_required
def getName():
    if request.method == 'GET':
        return db_manager.get_username()

@main.route('/getNotifs', methods=['GET'])
@login_required
def getNotifs():
    if request.method == 'GET':
        return db_manager.get_notifs()

@main.route('/editUser', methods=['POST'])
@login_required
def editUser():
    if request.method == 'POST':
        if (db_manager.edit_user(request.get_json(force=True))):
            return "success"
    return "invalid method"

@main.route('/addEvent', methods=['GET', 'POST']) 
def add_event():
    eventID = db_manager.add_event_to_database(request.get_json(force=True))
    json_post = {
        'eventID': eventID
    }
    return json_post
    # return xx_template(json_post)

@main.route('/deleteEvent', methods=['GET', 'POST'])
def delete_event():
    db_manager.delete_event_from_database(request.get_json(force=True)['eventID'])
    return 'success'
    # return xx_template('success')

@main.route('/deleteEventsByCourse', methods=['GET', 'POST'])
def delete_events_by_course():
    '''
    takes in a course_name from json: {'course': string}
    delete all events(e.g. Office Hours) associated with the course for current user
    '''
    target_events_id = db_manager.get_all_course_events(request.get_json(force=True)['course'])
    for event_id in target_events_id:
        db_manager.delete_event_from_database(event_id)
    return 'success'

@main.route('/editEvent', methods=['GET', 'POST']) 
def edit_event():
    event_obj = request.get_json(force=True)
    db_manager.edit_event_in_database(event_obj['eventID'], event_obj)
    return 'success'
    # return xx_template('success')

@main.route('/getCourses', methods=['GET', 'POST'])
@login_required
def get_courses():
    course_names = db_manager.get_all_courses()
    return course_names
    
@main.route('/getEventByUserAndDate', methods=['GET', 'POST']) 
def get_events_by_user_and_date():
    '''
    get event by userid + date
    takes in json: {"date": str}
    '''
    events_on_date = db_manager.get_events_by_user_and_date(request.get_json(force=True))
    events_json = [event.as_dict() for event in events_on_date]
    return json.dumps({'events': events_json})

@main.route('/filterEventByType', methods=['GET','POST'])
def filter_events_by_type():
    '''
    takes in json: {'event_type': int}
    '''
    events_of_type = db_manager.get_events_by_type(request.get_json(force=True)['event_type'])
    events_json = [event.as_dict() for event in events_of_type]
    return json.dumps({'events': events_json})

@main.route('/getEventById', methods=['GET', 'POST'])
def get_event_by_id():
    '''
    get event by eventID
    '''
    event_dict = db_manager.get_event_by_id(request.get_json(force=True)['eventID']).as_dict()
    return json.dumps({'event': event_dict})

@main.route('/schedule-meeting', methods=['GET','POST']) 
def schedule_meeting(): 
    available_time = db_manager.find_available_meeting_time(request.get_json(force=True))
    return json.dumps(available_time)

@main.route('/add-meeting', methods=['GET','POST'])
def add_meeting():
    return 'success'

@main.route('/deleteAll', methods=['GET'])
def clear_data():
    db_manager.clear_all()
    return "success"

@main.route('/getRoom', methods=['GET', 'POST'])
def get_room():
    cur_rf = RoomFinder(request.get_json(force=True))
    return cur_rf.find_room()
