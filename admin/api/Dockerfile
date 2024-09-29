FROM node:latest

WORKDIR /code

RUN apt update
RUN apt upgrade -y 
RUN apt install -y mc 
RUN apt install -y curl 
RUN apt install -y lsof
RUN apt install -y software-properties-common
RUN apt install -y redis-tools

COPY package*.json /code/
RUN yarn global add nodemon
RUN yarn install
RUN yarn add redis@4.6.13
COPY . /code/
