#!/bin/bash

# ./getssl.sh bnbadmin.ru
# ./getssl.sh bnbtest.ru
# ./getssl.sh bnbback.ru

apt update; apt install -y certbot
certbot certonly --standalone -d ${1}

