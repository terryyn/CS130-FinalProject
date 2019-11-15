from datetime import date, time
import unittest
from unittest.mock import Mock, patch
import json
from UCal import create_app, db, db_manager
from UCal.model import User, Event, EventType, Participation