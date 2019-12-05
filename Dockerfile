FROM ubuntu:latest
COPY ./UCal /UCal
COPY ./migrations /migrations
COPY ./config.py /config.py
COPY ./run_server.py /run_server.py
COPY ./requirements.txt /requirements.txt
COPY ./Procfile /Procfile
WORKDIR /
RUN apt-get update -y && \
    apt-get install -y python-pip python-dev
RUN pip install -r requirements.txt

RUN python run_server.py db stamp heads
RUN python run_server.py db migrate
RUN python run_server.py db upgrade
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["run_server.py" , "runserver"]