FROM node:latest
WORKDIR /code
RUN apt update
RUN apt upgrade -y 
RUN apt install -y mc 
RUN apt install lsof
# RUN apt install -y netstat
COPY . /code/
RUN yarn install
RUN npm install -g serve  
ENV PATH="/code/node_modules/.bin:${PATH}"
CMD ["/code/start.sh"]
