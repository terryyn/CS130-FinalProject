This directory contains both unit tests and integration tests implemented for the back end.
test_basics.py has the most basic test implemented.
test_db_manager.py has unit tests for methods in the DatabaseManager Class.
test_db_manager_integration.py has integration tests to test if methods in the DatabaseManager Class are interacting as expected with the database.
test_find_study_room.py has integration tests to test the interaction with external resouces when searching for a study room.


The unittests are to be run in the main directory using the following commands:
To run tests in one test file:
    python3 -m unittest tests.test_db_manager
To run tests in multiple test files:
    python3 -m unittest tests.test_db_manager tests.test_db_manager_integration
To run a particular test in a test file
    python3 -m unittest tests.test_db_manager.test_add_event


Some of the code in this is adapted from the book Flask Web Development-Developing Web Applications with Python [Grinberg 2014-05-18]