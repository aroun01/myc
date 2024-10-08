#!/bin/bash

# cd bnbtestru/root/root/airbnb_fullpack
# chmod +x shDeleteImages.sh

# ./shDeleteImages.sh

# Сохраняем текущее время начала выполнения скрипта
start_time=$(date +%s)

echo "Start removal process Docker images..."

images_folder="tools/saveimages"

if [ ! -d "$images_folder" ]; then
    mkdir "$images_folder"
fi

# Проверяем, есть ли файлы в папке saveimages
if [ -d "$images_folder" ] && [ "$(ls -A "$images_folder")" ]; then
    # Если есть, удаляем их перед сохранением новых образов
    rm -rf "$images_folder"/*
fi


# Считаем и выводим время выполнения скрипта
end_time=$(date +%s)
elapsed_time=$((end_time - start_time))
echo "Execution time: $elapsed_time seconds"

