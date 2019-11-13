from . import main
from .. import db
from ..models import User, Event

def add_event_to_database(event_json):
    # match the json object names
    new_event = Event(eventName=event_json[eventName], userID=event_json[userID], date=event_json[date], time=event_json[time], location=event_json[location], description=event_json[description], eventType=event_json[eventType], participants=event_json[participants])
    db.session.add(new_event)
    db.session.commit()
    return new_event[id]

def delete_event_from_database(eventID):
    db.session.delete(Event.query.get(eventID))
    db.session.commit()

def edit_event_in_database(eventID, changes_json):
    # match the json object names
    target = Event.query.get(eventID)
    for change in changes_json:
        if not change == 'eventID':
            target.change = changes_json[change]
    db.session.add(target)
    db.session.commit()

@main.route('/', methods=['GET', 'POST']) 
def index():

@main.route('/addEvent', methods=['GET', 'POST']) 
def add_event():
    eventID = add_event_to_database(request.form)
    json_post = {
        'eventID': eventID
    }
    return json_post
    # return xx_template(json_post)

@main.route('/deleteEvent', methods=['GET', 'POST']) 
def delete_event():
    delete_event_from_database(request.form['eventID'])
    return 'success'
    # return xx_template('success')

@main.route('/editEvent', methods=['GET', 'POST']) 
def edit_event():
    edit_event_in_database(request.form['eventID'], request.form)
    return 'success'
    # return xx_template('success')