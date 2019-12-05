FROM ubuntu:latest
COPY . /app
WORKDIR /app
RUN rm -rf node_modules package-lock.json yarn.lock
RUN apt-get update -y
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash
RUN apt-get install nodejs -y
RUN npm install
CMD ["npm", "start"]