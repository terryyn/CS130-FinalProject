from . import main
from .. import db, db_manager
from ..model import User, Event
from flask import request


@main.route('/', methods=['GET', 'POST']) 
def index():
    pass

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


@main.route('/schedule-meeting', methods=['GET','POST']) 
def schedule_meeting(): 
    json_available_time = db_manager.find_available_meeting_time(request.form)
    return 'success'

@main.route('/add-meeting', methods=['GET','POST'])
def add_meeting():
    pass