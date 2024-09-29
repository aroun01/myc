#!/bin/bash

# cd bnbtestru/root/root/airbnb_fullpack
# chmod +x shRebuildimages.sh

# ./shRebuildimages.sh

# Сохраняем текущее время начала выполнения скрипта
start_time=$(date +%s)

echo "Start rebuilding Docker images and containers..."

# Удаляем папки node_modules 
rm -rf admin/clientmain/node_modules
rm -rf user/clientmain/node_modules
rm -rf admin/clienttor/node_modules
rm -rf user/clienttor/node_modules

rm -rf admin/api/node_modules

docker rm -f $(sudo docker ps -aq)
docker rmi -f $(docker images -aq)

# Проверяем существование сети mynetwork
if docker network ls | grep -q 'mynetwork'; then
    docker network rm mynetwork
fi

# Автоматически отвечаем 'y' на вопрос при выполнении docker builder prune
yes | docker builder prune -a

# Получаем список архивов образов в папке saveimages, исключая файл images_list.txt
image_archives=$(ls -A "saveimages" | grep -v "images_list.txt")

# Проверяем, есть ли образы для загрузки
if [ -n "$image_archives" ]; then
    # Загружаем образы из папки saveimages в Docker
    for image_archive in $image_archives; do
        docker load -i "saveimages/$image_archive"
    done

    # Создаем контейнеры на основе восстановленных образов
    # docker-compose up -d
    docker compose up --build -d
    docker compose logs
else
    echo "No images found in saveimages directory."
fi

echo "Docker images and containers rebuilt successfully."

# Считаем и выводим время выполнения скрипта
end_time=$(date +%s)
elapsed_time=$((end_time - start_time))
echo "Execution time: $elapsed_time seconds"

