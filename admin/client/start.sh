#!/bin/bash

yarn install

# Запуск скрипта замены строки  
/code/replaceman.sh

yarn run dev --host --port 5173
# Запуск вашего приложения 
# serve --ssl-cert /code/ssl/fullchain.pem --ssl-key /code/ssl/privkey.pem -l 5173 -s dist

# yarn run dev --host 0.0.0.0 --port 5173
# yarn run dev --host 0.0.0.0 --port 5173 --https --ssl-cert /code/ssl/fullchain.pem --ssl-key /code/ssl/privkey.pem
# yarn run dev --host bnbtest.ru --port 5173
