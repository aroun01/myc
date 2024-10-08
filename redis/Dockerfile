FROM redis:latest

RUN apt update
RUN apt upgrade -y 
RUN apt install -y mc 
RUN apt install -y curl 
RUN apt install -y lsof
RUN apt install -y software-properties-common

CMD ["redis-server"]
