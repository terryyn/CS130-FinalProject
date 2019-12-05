import os
from UCal import create_app, db, db_manager
from UCal.model import User, Event, Participation, EventType, FrequencyType
from flask_script import Manager, Shell, Server
from flask_migrate import Migrate, MigrateCommand
app = create_app(os.getenv('FLASK_CONFIG') or 'dev')
manager = Manager(app)
migrate = Migrate(app, db)
def make_shell_context():
    return dict(app=app, db=db, db_manager = db_manager, \
                User=User, Event=Event, Participation=Participation, \
                EventType = EventType, FrequencyType = FrequencyType)

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)
port = int(os.environ.get('PORT', 5000))
manager.add_command("runserver", Server(host='0.0.0.0', port=port))

if __name__ == '__main__': 
    manager.run()

