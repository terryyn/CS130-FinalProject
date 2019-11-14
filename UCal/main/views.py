from . import main
from .. import db
from ..models import User, Event
from flask import request
import datetime

def read_event_json(event_json):
    # match the json object namesd
    start_date = datetime.datetime.strptime(event_json['startdate'] , '%Y-%m-%d')
    start_time = datetime.datetime.strptime(event_json['starttime'] , '%H:%M')
    end_date = datetime.datetime.strptime(event_json['enddate'] , '%Y-%m-%d')
    end_time = datetime.datetime.strptime(event_json['endtime'] , '%H:%M')
    return Event(name=event_json['name'], startdate=start_date, \
                starttime=start_time, location=event_json['location'], \
                eventType=event_json['type'], enddate=end_date, \
                endtime=end_time, description=event_json['description'])

def add_event_to_database(event_json):
    new_event = read_event_json(event_json)
    db.session.add(new_event)
    db.session.commit()
    return new_event[id]

def delete_event_from_database(eventID):
    target = Event.query.get(eventID)
    db.session.delete(target)
    db.session.commit()

def edit_event_in_database(eventID, changes_json):
    # match the json object names
    target = Event.query.get(eventID)
    for change in changes_json:
        if not change == 'eventID':
            target.change = changes_json[change]
    db.session.add(target)
    db.session.commit()

def get_events_by_user(req_json):
    # match the json object from client
    userid = req_json['userid']
    date = req_json['date']
    occupied_events = Event.query \
                    .join(Participation) \
                    .filter_by(Participation.user_id=userid, Event.date=date).all()
    return occupied_events

#Assume the json has "meeting_name, participants, list of days, meet_duration, earliest meet time, latest meet time"
#TODO: discuss the format of passed in earliest/latest meet time
#TODO: consider cases where there are events before earliest meeting time or lastest meet time
def find_available_meeting_time(event_json):
    meeting_name = request.form['meeting_name']
    participants = request.form['participants']
    possible_days = request.form.get('possible_days')
    meet_duration = request.form.get('meet_duration')
    earliest_meet_time = request.form.get('earliest_meet_time')
    lastest_meet_time = request.form.get('lastest_meet_time')

    occupied_events = db.session.query(Event.id, Event.date, Event.time) \
                             .filter(Event.date.in_(possible_days)) \
                             .join(Participation) \
                             .join(User).filter(User.username.in_(participants)) \
                             .distinct().all()

    occupied_time_dict = {}
    for event in occupied_events:
        if event.date not in occupied_time_dict:
            occupied_time_dict[event.date] = [event.time]
        else:
            occupied_time_dict[event.date].append(event.time)
    
    '''
    the current format of possible meeting time is 
    [{date: [(start_time_1, end_time_1),(start_time_2, end_time_2)]},...]
    
    '''
    all_possible_time_slots = []
    for possible_day in possible_days:
        if possible_day not in occupied_time_dict:
            all_possible_time_slots.append({possible_day:[(earliest_meet_time, latest_meet_time)]})
        else:
            possible_time_slots = []
            for i in len(occupied_time_dict[possible_day]) - 1:
                time_diff = (datetime.combine(datetime.today(), occupied_time_dict[possible_day][i+1][0]) \
                            - datetime.combine(datetime.today(), occupied_time_dict[possible_day][i][1])) \
                            .total_seconds()/60
                if meet_duration < time_diff:
                    possible_time_slots.append((occupied_time_dict[possible_day][i][1], occupied_time_dict[possible_day][i+1][0]))
            
            earliest_time_diff = (datetime.combine(datetime.today(), occupied_time_dict[possible_day][0][0]) \
                            - datetime.combine(datetime.today(), earliest_meet_time)) \
                            .total_seconds() / 60
            latest_time_diff = (datetime.combine(datetime.today(), latest_time_diff) \
                            - datetime.combine(datetime.today(), occupied_time_dict[possible_day][-1][1])) \
                            .total_seconds() / 60
            
            if meet_duration < earliest_time_diff:
                possible_time_slots.append((earliest_time_diff, occupied_time_dict[possible_day][0][0]))
            if meet_duration < latest_time_diff:
                possible_time_slots.append((occupied_time_dict[possible_day][-1][1], latest_time_diff))

            if possible_time_slots:
                all_possible_time_slots.append({possible_day : possible_time_slots})
    
    return all_possible_time_slots


@main.route('/', methods=['GET', 'POST']) 
def index():
    pass

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

# get event by userid + date
@main.route('/getEventByUserAndDate', methods=['GET', 'POST']) 
def get_events_by_user_and_date():
    return events_on_date = get_events_by_user(request.form)

# get event by eventID
@main.route('/getEventById', methods=['GET', 'POST']) 
def get_event_by_id():
    return Event.query.get(request.form['eventID'])

@main.route('/add-meeting', methods=['GET','POST']) 
def add_meetings(): 
    return find_available_meeting_time(request.form)
    