FROM ubuntu:latest
COPY . .
RUN apt-get update -y && \
    apt-get install -y python-pip python-dev
RUN pip install flask
RUN pip install flask-cors

RUN flask run
RUN python init_db.py