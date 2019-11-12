from . import main
from .. import db
from ..models import User, Event

@main.route('/', methods=['GET', 'POST']) 
def index():