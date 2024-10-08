#!/bin/bash


npm audit fix --dev
yarn install
yarn add https
# Запуск скрипта замены строки 
/code/replaceman.sh

# Запуск вашего приложения  
yarn run dev
