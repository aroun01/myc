#!/bin/bash

yarn install

# Запуск скрипта замены строки 
/code/replaceman.sh

# Запуск приложения
yarn run dev --host --port 5174

# yarn run dev --host 0.0.0.0 --port 5174
# serve --ssl-cert /code/ssl/fullchain.pem --ssl-key /code/ssl/privkey.pem -l 5174 -s dist
# yarn run dev --host 0.0.0.0 --port 5174 --https --ssl-cert /code/ssl/fullchain.pem --ssl-key /code/ssl/privkey.pem