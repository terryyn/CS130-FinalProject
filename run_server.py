import os
from UCal import create_app, db
from UCal.model import User, Event, Participation
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand
app = create_app(os.getenv('FLASK_CONFIG') or 'dev') 
manager = Manager(app)
migrate = Migrate(app, db)
def make_shell_context():
    return dict(app=app, db=db, User=User, Event=Event, Participation=Participation)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)

if __name__ == '__main__': 
    manager.run()

