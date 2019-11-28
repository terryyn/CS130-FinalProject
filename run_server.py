import os
from UCal import create_app, db, db_manager
from UCal.model import User, Event, Participation, EventType
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand
app = create_app(os.getenv('FLASK_CONFIG') or 'dev')
manager = Manager(app)
migrate = Migrate(app, db)
def make_shell_context():
    return dict(app=app, db=db, db_manager = db_manager, User=User, Event=Event, Participation=Participation, EventType = EventType)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)

if __name__ == '__main__': 
    manager.run()

