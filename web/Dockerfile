FROM phusion/baseimage:jammy-1.0.2

RUN apt update; apt upgrade -y ; 
RUN apt install lsof mc nano -y; 
# RUN apt install -y nmap ; 
RUN apt install -y mc vim curl software-properties-common; add-apt-repository -y ppa:ondrej/nginx-mainline; apt install -y nginx tor;

