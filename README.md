# CS130-FinalProject
 
 
A calendar web app that is used inside UCLA. It is able to find available timeslot for those who want to have a meeting and find open study room for them.  
  
Documentation for all backend modules are generated by pydoc, located in Documentation folder, and is to be integrated to be accessible through flask app.  

Backend python code used flake8 linter. 

## Start python flask server:
python run_server.py db upgrade (this command initialize/upgrade your database)

python run_server.py runserver

**If anyone changes database schema, please run the following commands to update and keep track of the database changes:**


python run_server.py db migrate -m "commit message"

python run_server.py db upgrade

## Run Dockerized Application

docker-compose up -d --build

Navigate to localhost:3000 to start using the app


## Frontend documentation

To run:
`npm start`

The code is organized as follows:
```
/app
|- App.js  // base App file with global logic
|- server.js // HTTP request abstraction layer
|- /components // dummy components (ideally stateless)
|- /containers // typically views which contain actual business logic
    |- /snapshots // frontend test snapshots
|- /styles // contains stylesheets for views
```

