#!/bin/bash

# cd bnbtestru/root/root/airbnb_fullpack
# chmod +x shDeletegag.sh

# ./shDeleteGag.sh

# Скрипт удаления пустышек с именованиями <none>
# REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
# <none>       <none>    5d81e293cfcd   41 minutes ago   454MB
# <none>       <none>    d26d98976b29   42 minutes ago   1.29GB
# <none>       <none>    21c2666a001f   42 minutes ago   2.01GB
# <none>       <none>    ef38a9060e8b   43 minutes ago   1.89GB
# <none>       <none>    b0e73c0ded68   43 minutes ago   346MB
# <none>       <none>    772dde754068   43 minutes ago   1.09GB

# Сохраняем текущее время начала выполнения скрипта
start_time=$(date +%s)

echo "Start removing Docker images with tag <none>..."

# Получаем список образов с тегом <none>
images=$(docker images | grep "<none>" | awk '{print $3}')

# Удаляем образы с тегом <none>
if [ -n "$images" ]; then
    docker rmi -f $images
    echo "Docker images with tag <none> removed successfully."
else
    echo "No Docker images with tag <none> found."
fi

# Считаем и выводим время выполнения скрипта
end_time=$(date +%s)
elapsed_time=$((end_time - start_time))
echo "Execution time: $elapsed_time seconds"


