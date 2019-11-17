from . import main
from .. import db_manager
from flask import request, redirect, render_template


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
        db_manager.add_user(request.form)
        return "rendering login template"
    return "rendering signup template"

@main.route('/logIn', methods=['GET','POST']) 
def log_in():
    if request.method == 'POST':
        user_id = db_manager.log_in(request.form)
        return "rendering index template with user id"
    return "rendering login template"

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

@main.route('/getEventByUserAndDate', methods=['GET', 'POST']) 
def get_events_by_user_and_date():
    '''
    get event by userid + date
    '''
    events_on_date = db_manager.get_events_by_user_and_date(request.form)
    return events_on_date

@main.route('/getEventById', methods=['GET', 'POST'])
def get_event_by_id():
    '''
    get event by eventID
    '''
    return Event.query.get(request.form['eventID'])

@main.route('/schedule-meeting', methods=['GET','POST']) 
def schedule_meeting(): 
    json_available_time = db_manager.find_available_meeting_time(request.form)
    return 'success'

@main.route('/add-meeting', methods=['GET','POST'])
def add_meeting():
    return 'success'
