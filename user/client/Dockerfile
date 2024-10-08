FROM node:latest
WORKDIR /code
RUN apt update
RUN apt upgrade -y 
RUN apt install -y mc 
RUN apt install lsof
COPY . /code/
RUN yarn install
ENV PATH="/code/node_modules/.bin:${PATH}"
CMD ["/code/start.sh"]
