from flask_login import UserMixin, AnonymousUserMixin
from . import db, login_manager

'''
table users
user_id | user_name | email | password | is_instructor
'''

class User(UserMixin, db.Model):
    __table_name__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(64), unique=True, index = True)
    email = db.Column(db.String(128), unique=True, index = True)
    password_hash = db.Column(db.String(128))

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)




    