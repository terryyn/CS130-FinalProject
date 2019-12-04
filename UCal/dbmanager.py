# flake8 compatible
from datetime import datetime, date, time, timedelta
from collections import defaultdict
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .model import Event, User, Participation, EventType, FrequencyType
from flask_login import login_user, login_required, current_user, logout_user
import sqlalchemy

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
            return {'name': current_user.username, 'email': current_user.email, 'is_instructor': current_user.is_instructor, 'courses': current_user.courses}
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
        if (user_json['courses']!=''):
            current_user.courses = user_json['courses']

        db.session.commit()
        return True

    @staticmethod
    def convert_date(date):
        return datetime.strptime(
            date, '%Y-%m-%d'
        ).date()

    @staticmethod
    def convert_time(time, has_seconds=False):
        if has_seconds:
            return datetime.strptime(
            time, '%H:%M:%S'
        ).time()
        return datetime.strptime(
            time, '%H:%M'
        ).time()

    def read_event_json(self, event_json):
        '''
        Takes in a json-converted dict including 8 fields about an event:
        name: string, startdate: string, starttime: string, location: string,
        type: string, enddate: string, endtime: string, description: string
        Returns an Event object initiated with the above information
        '''
        start_date = self.convert_date(event_json['startdate'])
        start_time = self.convert_time(event_json['starttime'])
        end_date = self.convert_date(event_json['enddate'])
        end_time = self.convert_time(event_json['endtime'])
        if event_json['course']!='':
            return Event(
                name=event_json['name'], startdate=start_date,
                starttime=start_time, location=event_json['location'],
                eventType=event_json['type'], enddate=end_date,
                frequencyType=event_json['frequency_type'],
                endtime=end_time, description=event_json['description'], course=event_json['course'])
        elif event_json['guests']!='':
            return Event(
                name=event_json['name'], startdate=start_date,
                starttime=start_time, location=event_json['location'],
                eventType=event_json['type'], enddate=end_date,
                endtime=end_time, description=event_json['description'], guests=event_json['guests'])
        else:
            return Event(
                name=event_json['name'], startdate=start_date,
                starttime=start_time, location=event_json['location'],
                eventType=event_json['type'], enddate=end_date,
                endtime=end_time, description=event_json['description'])
    
    def getUsersWithEmail(self, guests):
        ret = []
        emails = guests.split(',')
        for i in range(len(emails)):
            emails[i] = emails[i].strip()
            user = User.query.filter_by(email=emails[i]).first()
            ret.append(user)
        return ret

    def getUsersWithCourse(self, course):
        ret = []
        users = User.query.all()
        for u in users:
            if u.courses!='' and u.id!=current_user.id:
                courses = u.courses.split(',')
                if course in courses:
                    ret.append(u)
        return ret

    @login_required
    def add_event_to_database(self, event_json):
        '''
        Takes in a json-converted dict including 8 fields about an event:
        name: string, startdate: string, starttime: string, location: string,
        type: string, enddate: string, endtime: string, description: string
        Returns the event id of the event added, or the existing event.
        '''
        new_event = self.read_event_json(event_json)
        old_event = Event.query.filter(Event.name == new_event.name,
                    Event.startdate == new_event.startdate,
                    Event.starttime == new_event.starttime,
                    Event.location == new_event.location,
                    Event.eventType == new_event.eventType,
                    Event.frequencyType == new_event.frequencyType,
                    Event.enddate == new_event.enddate,
                    Event.endtime == new_event.endtime,
                    Event.description == new_event.description)
        if not old_event.count():
            db.session.add(new_event)
            db.session.commit()
            event_id = new_event.id
        else:
            event_id = old_event.one_or_none().id
        
        #Try to send notifications to users if course exists
        try:
            users_to_notify = self.getUsersWithCourse(new_event.course)
            for u in users_to_notify:
                try:
                    db.session.add(Participation(event_id=event_id, user_id=u.id))
                    db.session.commit()
                except sqlalchemy.exc.IntegrityError:
                    pass
        except:
            pass
        
        #Try to send notifications to guests if guests exists
        try:
            users_to_notify = self.getUsersWithEmail(new_event.guests)
            for u in users_to_notify:
                try:
                    db.session.add(Participation(event_id=event_id, user_id=u.id))
                    db.session.commit()
                except sqlalchemy.exc.IntegrityError:
                    pass
        except:
            pass
            
        try:
            db.session.add(Participation(event_id=event_id, user_id=current_user.id))
            db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            pass
        return event_id

    @login_required
    def delete_event_from_database(self, eventID):
        '''
        Takes in the event id of the event and deletes the event.
        No return value.
        '''
        #first checks how many users are related to this event
        num_of_participants = Participation.query.filter(Participation.event_id == eventID).count()
        Participation.query.filter(Participation.event_id == eventID, \
                            Participation.user_id == current_user.id).delete()

        if num_of_participants == 1:
            Event.query.filter(Event.id == eventID).delete()

        db.session.commit()

    def get_all_course_events(self, course_name):
        '''
        takes in the course name
        return a lists of events' id associated with the course and the course itself
        '''
        course_events = Event.query.join(Participation).filter(Event.course.contains(course_name), \
                                    Participation.user_id == current_user.id).all()
        event_ids = [event.id for event in course_events]
        return event_ids

    def edit_event_in_database(self, eventID, changes_json):
        '''
        Takes in the event id of the event and a json-converted dict same as
        the argument of add_event_to_database containing the updated info
        No return value.
        '''
        target = Event.query.get(eventID)
        for change in changes_json:
            if not change == 'eventID':
                value = changes_json[change]
                if change == 'startdate' or change == 'enddate':
                    setattr(target, change, self.convert_date(value))
                elif change == 'starttime' or change == 'endtime':
                    setattr(target, change, self.convert_time(value, has_seconds=True))
                else:
                    setattr(target, change, changes_json[change])
        db.session.add(target)
        db.session.commit()

    def get_event_by_id(self, eventID):
        target = Event.query.get(eventID)
        return target

    def get_events_by_user_and_date(self, req_json):
        '''
        Takes in a json-converted dict containing the userid and date
        requested. Return the list of events satisfying the condition.
        '''
        # match the json object from client
        userid = current_user.id
        date_str = req_json['date']
        date = datetime.strptime(date_str, '%a %b %d %Y').date()
        start_dow = sqlalchemy.func.extract('dow', Event.startdate)
        end_dow = sqlalchemy.func.extract('dow', Event.enddate)
        start_day = sqlalchemy.func.extract('day', Event.startdate)
        end_day = sqlalchemy.func.extract('day', Event.enddate)

        occupied_events = Event.query.join(Participation).filter(Participation.user_id == userid)\
        .filter(db.or_(db.and_(Event.frequencyType == FrequencyType.DEFAULT, 
                                            Event.startdate <= date,  Event.enddate >= date), 
                                    db.and_(Event.frequencyType == FrequencyType.DAILY,
                                            Event.startdate <= date),
                                    db.and_(Event.frequencyType == FrequencyType.WEEKLY, 
                                            db.or_(
                                                db.and_(start_dow <= end_dow,
                                                        start_dow <= date.isoweekday(), 
                                                        end_dow >= date.isoweekday()),
                                                db.and_(start_dow >= end_dow,
                                                        db.or_(start_dow <= date.isoweekday(),
                                                                end_dow >= date.isoweekday()))
                                                )),
                                    db.and_(Event.frequencyType == FrequencyType.MONTHLY,
                                            db.or_(
                                                db.and_(start_day <= end_day,
                                                        start_day <= date.day, 
                                                        end_day >= date.day),
                                                db.and_(start_day >= end_day,
                                                        db.or_(start_day <= date.day,
                                                                end_dow >= date.day))
                                                )))).order_by(Event.startdate).all()

        return occupied_events

    def get_events_by_type(self, event_type):
        '''
        Takes in a event_type(int).
        Return a list of events of this type
        '''
        userid = current_user.id
        events_of_type = Event.query.join(Participation).filter(
            Participation.user_id == userid,
            Event.eventType == event_type
        ).all()
        return events_of_type

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

    def get_all_courses(self):
        course_names = [ r.name for r in db.session.query(Event.name) \
                            .join(Participation) \
                            .filter(Participation.user_id == current_user.id) \
                            .filter(Event.eventType == EventType.COURSE)]
        return {"course_names" : course_names}

    #Currently only consider meetings that has duration less than one day
    # TODO: discuss the format of passed in earliest/latest meet time
    def find_available_meeting_time(self, meeting_json):
        '''
        Takes in the json-converted dict containing:
        meeting_name : string, pariticipants : List[string],
        possible_dates: List[date string], meet_duration: integer that represents minutes,
        earliest_meet_time: time string,
        latest_meet_time: time string,
        Returns a list of possible meeting time, in the format:
        [{date: [(start_time_1, end_time_1),(start_time_2, end_time_2)]},...]
        '''

        participants = meeting_json['participants'].split(',')
        possible_dates = []
        earliest_meet_date = self.convert_date(meeting_json['earliest_meet_date'])
        latest_meet_date = self.convert_date(meeting_json['latest_meet_date'])
        step = timedelta(days=1)
        
        while earliest_meet_date <= latest_meet_date:
            possible_dates.append(earliest_meet_date)
            earliest_meet_date += step
        
        possible_days = [day.isoweekday() for day in possible_dates]
        meet_duration = meeting_json['meet_duration']
        earliest_meet_time = self.convert_time(meeting_json['earliest_meet_time'])
        latest_meet_time = self.convert_time(meeting_json['latest_meet_time'])

        # Get all the events within dates
        occupied_events = db.session.query(
            Event.id, Event.startdate, Event.starttime, Event.endtime, Event.frequencyType).filter(
            db.or_(Event.startdate.in_(possible_dates),
                    db.and_(Event.frequencyType == FrequencyType.DAILY,
                    Event.startdate <= possible_dates[0]),
                    db.and_(Event.frequencyType == FrequencyType.WEEKLY,
                    sqlalchemy.func.extract('dow', Event.startdate).in_(possible_days)),
                    db.and_(Event.frequencyType == FrequencyType.MONTHLY,
                    sqlalchemy.func.extract('day', Event.startdate).in_([date.day for date in possible_dates])))
        ).join(Participation).join(User).filter(
                User.email.in_(participants)
        ).distinct().all()

        # Finds all the occupied time slots in those dates 
        occupied_time_dict = defaultdict(list)
        for event in occupied_events:
            if event.frequencyType == FrequencyType.DAILY:
                for date in possible_dates:
                    if event.startdate <= date:
                        occupied_time_dict[date].append((event.starttime, event.endtime))

            elif event.frequencyType == FrequencyType.WEEKLY:
                for date in possible_dates:
                    if event.startdate.isoweekday() == date.isoweekday():
                        occupied_time_dict[date].append((event.starttime, event.endtime))
            elif event.frequencyType == FrequencyType.MONTHLY:
                for date in possible_dates:
                    if event.startdate.day == date.day:
                        occupied_time_dict[date].append((event.starttime, event.endtime))
            else:
                occupied_time_dict[event.startdate].append((event.starttime, event.endtime))

        for date in occupied_time_dict:
            occupied_time_dict[date].sort()
        
        '''
        the current format of possible meeting time is
        [{date: [(start_time_1, end_time_1),(start_time_2, end_time_2)]},...]
        '''
        all_possible_time_slots = {}
        for possible_date in possible_dates:
            if possible_date not in occupied_time_dict:
                all_possible_time_slots[possible_date] = [(earliest_meet_time, latest_meet_time)]
            else:
                possible_time_slots = []
                for i in range(len(occupied_time_dict[possible_date]) - 1):
                    time_diff = (
                        datetime.combine(
                            datetime.today(),
                            occupied_time_dict[possible_date][i+1][0]
                        )
                        - datetime.combine(
                            datetime.today(),
                            occupied_time_dict[possible_date][i][1]
                        )
                    ).total_seconds() / 60
                    if meet_duration <= time_diff:
                        possible_time_slots.append((
                            occupied_time_dict[possible_date][i][1],
                            occupied_time_dict[possible_date][i+1][0]
                        ))

                earliest_time_diff = (
                    datetime.combine(
                        datetime.today(),
                        occupied_time_dict[possible_date][0][0]
                    ) - datetime.combine(
                        datetime.today(), earliest_meet_time)
                    ).total_seconds() / 60
                latest_time_diff = (
                    datetime.combine(datetime.today(), latest_meet_time)
                    - datetime.combine(
                        datetime.today(),
                        occupied_time_dict[possible_date][-1][1]
                    )).total_seconds() / 60

                if meet_duration <= earliest_time_diff:
                    possible_time_slots.append((earliest_meet_time, occupied_time_dict[possible_date][0][0]))
                if meet_duration <= latest_time_diff:
                    possible_time_slots.append((occupied_time_dict[possible_date][-1][1], latest_meet_time))

                if possible_time_slots:
                    all_possible_time_slots[possible_date] = possible_time_slots
        
        return self.format_time_slot_lists(all_possible_time_slots, meet_duration)

    def format_time_slot_lists(self,time_slots, meeting_duration):
        '''
        divide previous large time blocks into small time blocks with the same length of meeting
        return format:
        ['2019-12-05 09:00-09:30', '2019-12-05 09:30-10:00']
        '''
        time_slot_lists = []
        for date in time_slots:
            for time_range in time_slots[date]:
                meeting_start_time = time_range[0]
                while meeting_start_time < time_range[1]:
                    meeting_end_time = (datetime.combine(
                        datetime.today(),
                        meeting_start_time
                        ) + timedelta(minutes=meeting_duration)).time()
                    if meeting_end_time <= time_range[1]:
                        time_str = date.strftime("%Y-%m-%d ") + meeting_start_time.strftime("%H:%M-") + meeting_end_time.strftime("%H:%M")
                        time_slot_lists.append(time_str)
                    meeting_start_time = (datetime.combine(
                        datetime.today(),
                        meeting_start_time
                        ) + timedelta(minutes=30)).time()
        return time_slot_lists
    
    def clear_all(self):
        meta = db.metadata
        for table in reversed(meta.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
