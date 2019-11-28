# flake8 compatible
import datetime
import time
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .model import Event, User, Participation
from flask_login import login_user, login_required, current_user, logout_user

def convertToBool(x):
    return x.lower()=='true'

class DatabaseManager():
    __instance = None
    @staticmethod
    def getInstance():
        '''
        Static access method for database manager. 
        Only initialized once to enforce the Singleton design pattern.
        '''
        if DatabaseManager.__instance is None:
            DatabaseManager()
        return DatabaseManager.__instance

    def __init__(self):
        '''
        Virtually private constructor.
        '''
        if DatabaseManager.__instance is not None:
            raise Exception("You can only create one database manager!")
        else:
            DatabaseManager.__instance = self

    def add_user(self, user_json):
        '''
        Takes in a json-converted dict including 4 fields about a user:
        username: string, email: string,
        password: string, is_instructor: string
        Returns True when the user with the same username or email does not
        exist in database and a new user is created.
        Returns False otherwise.
        '''
        has_user = User.query.filter(db.or_(
            User.email == user_json['email']
        )).first()
        if not has_user:
            new_user = User(
                username=user_json['username'],
                email=user_json['email'],
                password_hash=generate_password_hash(user_json['password']),
                is_instructor=convertToBool(user_json['is_instructor']),
            )
            db.session.add(new_user)
            db.session.commit()
            return True
        return False

    def log_in(self, user_json):
        '''
        Takes in a json-converted dict including 2 fields about a user:
        username: string, password: string
        Checks if a user exists in the database and if the password is correct.
        If exists and correct, returns the User object; Otherwise, None.
        '''
        current_user = User.query.filter_by(
            email=user_json['email']
            ).first()
        if not current_user:
            return -1
        remember = convertToBool(user_json['remember'])
        if check_password_hash(current_user.password_hash, user_json['password']):
            login_user(current_user, remember=remember)
            return {'name': current_user.username, 'email': current_user.email, 'is_instructor': current_user.is_instructor}
        else:
            return -2
        return -3
    
    def auth(self):
        if current_user.is_authenticated:
            return {'name': current_user.username, 'email': current_user.email, 'is_instructor': current_user.is_instructor}
        else:
            return None
    
    @login_required
    def logout(self):
        logout_user()
    
    @login_required
    def get_username(self):
        return current_user.username

    @login_required
    def edit_user(self, user_json):
        '''
        Takes in a json-converted dict including 4 fields about a user:
        username: string, email: string,
        password: string, is_instructor: string
        Updates existing user info in the database.
        '''
        current_user.username = user_json['username']
        current_user.email = user_json['email']
        current_user.is_instructor = convertToBool(user_json['is_instructor'])
        if (len(user_json['password'])>2) :
            current_user.password_hash = str(generate_password_hash(user_json['password']))
        db.session.commit()
        return True

    def read_event_json(self, event_json):
        '''
        Takes in a json-converted dict including 8 fields about an event:
        name: string, startdate: string, starttime: string, location: string,
        type: string, enddate: string, endtime: string, description: string
        Returns an Event object initiated with the above information
        '''
        start_date = datetime.datetime.strptime(
            event_json['startdate'], '%Y-%m-%d'
        ).date()
        start_time = datetime.datetime.strptime(
            event_json['starttime'], '%H:%M'
        ).time()
        end_date = datetime.datetime.strptime(
            event_json['enddate'], '%Y-%m-%d'
        ).date()
        end_time = datetime.datetime.strptime(
            event_json['endtime'], '%H:%M'
        ).time()
        return Event(
            name=event_json['name'], startdate=start_date,
            starttime=start_time, location=event_json['location'],
            eventType=event_json['type'], enddate=end_date,
            endtime=end_time, description=event_json['description'])

    @login_required
    def add_event_to_database(self, event_json):
        '''
        Takes in a json-converted dict including 8 fields about an event:
        name: string, startdate: string, starttime: string, location: string,
        type: string, enddate: string, endtime: string, description: string
        Returns the event id of the event added, or the existing event.
        '''
        new_event = self.read_event_json(event_json)
        old_event = Event.query.filter(Event.name == new_event.name, \
                    Event.startdate == new_event.startdate, \
                    Event.starttime == new_event.starttime, \
                    Event.starttime == new_event.starttime, \
                    Event.location == new_event.location, \
                    Event.eventType == new_event.eventType, \
                    Event.enddate == new_event.enddate, \
                    Event.endtime == new_event.endtime, \
                    Event.description == new_event.description)
        if not old_event.count():
            db.session.add(new_event)
            db.session.commit()
            event_id = new_event.id
        else:
            event_id = old_event.id

        db.session.add(Participation(event_id=event_id, user_id=current_user.id))
        db.session.commit()
        return event_id

    @login_required
    def delete_event_from_database(self, eventID):
        '''
        Takes in the event id of the event and deletes the event.
        No return value.
        '''
        target_event = Event.query.get(eventID)

        #first checks how many users are related to this event
        num_of_participants = Participation.query.filter(Participation.event_id == target_event.id).count()
        current_participation = Participation.query.filter(Participation.event_id == target_event, \
                            Participation.user_id == current_user.id)

        if num_of_participants == 1:
            db.session.delete(target_event)

        db.session.delete(current_participation)
        db.session.commit()

    def edit_event_in_database(self, eventID, changes_json):
        '''
        Takes in the event id of the event and a json-converted dict same as
        the argument of add_event_to_database containing the updated info
        No return value.
        '''
        target = Event.query.get(eventID)
        for change in changes_json:
            if not change == 'eventID':
                target.change = changes_json[change]
        db.session.add(target)
        db.session.commit()

    def get_events_by_user_and_date(self, req_json):
        '''
        Takes in a json-converted dict containing the userid and date
        requested. Return the list of events satisfying the condition.
        '''
        # match the json object from client
        userid = current_user.id
        date = req_json['date']
        occupied_events = Event.query.join(Participation).filter(
            Participation.user_id == userid,
            Event.startdate <= date, Event.enddate >= date
        ).order_by(Event.startdate).all()
        return occupied_events

    def get_students(self, course_name):
        '''
        Takes in the course name string.
        Return a list of student ids enrolled in the course.
        '''
        rows = Participation.query.join(Event).filter(
            Event.name == course_name
        ).all()
        students_id = []
        for row in rows:
            students_id.append(row.user_id)
        return students_id

    # TODO: discuss the format of passed in earliest/latest meet time
    # TODO: consider cases where there are events before earliest meeting time or lastest meet time
    def find_available_meeting_time(self, event_json):
        '''
        Takes in the json-converted dict containing:
        meeting_name : string, pariticipants : List[string],
        possible_days: List[datetime.datetime], meet_duration: int,
        earliest_meet_time: datetime.datetime,
        latest_meet_time: datetime.datetime
        Returns a list of possible meeting time, in the format:
        [{date: [(start_time_1, end_time_1),(start_time_2, end_time_2)]},...]
        '''
        participants = event_json['participants']
        possible_days = event_json['possible_days']
        meet_duration = event_json['meet_duration']
        earliest_meet_time = event_json['earliest_meet_time']
        latest_meet_time = event_json['latest_meet_time']

        occupied_events = db.session.query(
            Event.id, Event.date, Event.time
        ).filter(
            Event.date.in_(possible_days)
        ).join(Participation).join(User).filter(
                User.username.in_(participants)
        ).distinct().all()

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
                all_possible_time_slots.append(
                    {possible_day: [(earliest_meet_time, latest_meet_time)]}
                )
            else:
                possible_time_slots = []
                for i in len(occupied_time_dict[possible_day]) - 1:
                    time_diff = (
                        datetime.combine(
                            datetime.today(),
                            occupied_time_dict[possible_day][i+1][0]
                        )
                        - datetime.combine(
                            datetime.today(),
                            occupied_time_dict[possible_day][i][1]
                        )
                    ).total_seconds() / 60
                    if meet_duration < time_diff:
                        possible_time_slots.append((
                            occupied_time_dict[possible_day][i][1],
                            occupied_time_dict[possible_day][i+1][0]
                        ))

                earliest_time_diff = (
                    datetime.combine(
                        datetime.today(),
                        occupied_time_dict[possible_day][0][0]
                    ) - datetime.combine(
                        datetime.today(), earliest_meet_time)
                    ).total_seconds() / 60
                latest_time_diff = (
                    datetime.combine(datetime.today(), latest_meet_time)
                    - datetime.combine(
                        datetime.today(),
                        occupied_time_dict[possible_day][-1][1]
                    )).total_seconds() / 60

                if meet_duration < earliest_time_diff:
                    possible_time_slots.append((earliest_time_diff, occupied_time_dict[possible_day][0][0]))
                if meet_duration < latest_time_diff:
                    possible_time_slots.append((occupied_time_dict[possible_day][-1][1], latest_time_diff))

                if possible_time_slots:
                    all_possible_time_slots.append(
                        {possible_day: possible_time_slots}
                    )

        return all_possible_time_slots
    
    def clear_all(self):
        meta = db.metadata
        for table in reversed(meta.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
