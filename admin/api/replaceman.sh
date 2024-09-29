#!/bin/bash

# https://stackoverflow.com/questions/77587325/deprecationwarning-the-punycode-module-is-deprecated
# Путь к файлу, в котором нужно заменить строку
file_path="/code/node_modules/tr46/index.js"

# Строка для замены
old_line='const punycode = require("punycode");'
new_line='const punycode = require("punycode/");'

# Проверяем, существует ли файл
if [ -f "$file_path" ]; then
    # Заменяем строку в файле
    sed -i "s|$old_line|$new_line|g" "$file_path"
    echo "Строка заменена успешно в файле $file_path"
else
    echo "Файл $file_path не найден"
    exit 1
fi