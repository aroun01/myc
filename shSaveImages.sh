#!/bin/bash

# cd bnbtestru/root/root/airbnb_fullpack
# chmod +x shSaveimages.sh

# ./shSaveimages.sh

# Сохраняем текущее время начала выполнения скрипта
start_time=$(date +%s)

echo "Start saving Docker images..."

# Название папки для сохранения образов и файла с информацией
images_folder="tools/saveimages"
images_list_file="$images_folder/images_list.txt"

# Создаем папку для сохранения образов, если она не существует
if [ ! -d "$images_folder" ]; then
    mkdir "$images_folder"
fi

# Функция для сохранения образа и записи его имени в файл
save_image() {
    image_name=$1
    # Сохраняем образ с тегом "latest" в папку saveimages
    docker save -o "$images_folder/$image_name".tar "$image_name":latest
    # Записываем имя образа и размер в файл images_list.txt
    size=$(du -h "$images_folder/$image_name.tar" | awk '{print $1}')
    echo "$image_name: $size" >> "$images_list_file"
}

# Проверяем, есть ли файлы в папке saveimages
if [ -d "$images_folder" ] && [ "$(ls -A "$images_folder")" ]; then
    # Если есть, удаляем их перед сохранением новых образов
    rm -rf "$images_folder"/*
fi

# Сохраняем образы с помощью функции save_image 
save_image "redis"
save_image "back"
save_image "clientmain"
save_image "frontmain"
save_image "clienttor"
save_image "fronttor"
save_image "taskman"
save_image "web"

# Вычисляем сумму размеров всех архивов образов
total_size=$(du -ch "$images_folder"/*.tar | grep total | awk '{print $1}')

echo "Docker images saved successfully."

# Записываем сумму всех размеров архивов и размер каждого архива в файл
echo "Total size of Docker images: $total_size" >> "$images_list_file"

# Выводим содержимое файла images_list.txt
cat "$images_list_file"

# Считаем и выводим время выполнения скрипта
end_time=$(date +%s)
elapsed_time=$((end_time - start_time))
echo "Execution time: $elapsed_time seconds"

