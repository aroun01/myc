#!/bin/bash

# cd /airbnb_fullpack
# chmod +x shSbbtsOnionFront.sh

# ./shSbbtsOnionFront.sh air2262se4od65nopgzi7w3bc4mcjl7nyzr4dylibhitjkk3te2nfhad.onion

start_time=$(date +%s)

if [ -z "$1" ]; then
    echo "No parametr nameonion..."
    exit 1
fi

if [ $# -eq 0 ]; then
    echo "Usage: $0 <nameonion>"
    exit 1
fi

nameonion=$1

echo "Start building BnbTestSystem in OnionFront..."

# Удаляем папки node_modules 
rm -rf admin/client/node_modules
rm -rf user/client/node_modules

rm -rf admin/api/node_modules


#----------------------------------------
# Проверяем наличие папки /tools/onions/nameonion
if [ ! -d "tools/onions/$nameonion" ]; then
    echo "No complete set of OnionKeys..."
    exit 1
fi

rm -rf web/hidden_service/*

cp -r tools/onions/$nameonion web/hidden_service/


# # Функция для извлечения данных из JSON-файла
extract_data() {
    local file="$1"
    local type="$2"
    local data=$(jq -r '.[] | "\(.IP):\(.Port)"' "$file" | tr '\n' ',' | sed 's/,$//')

    if [ "$type" == "entry" ]; then
        echo "EntryNodes $data"
    else
        echo "ExitNodes $data"
    fi
}


# ==========================================
# ==========================================
# ==========================================
# ВАРИАНТЫ НАСТРОЙКИ КОНФИГУРАЦИИ ТОРа.
# Выбираем один из трех, остальные комментируем.

# ВАРИАНТ 0. (ДЕФОЛТ)
echo -e "\nLog notice file /var/log/tor/notices.log\nLog debug file /var/log/tor/debug.log\nLog info file /var/log/tor/info.log\n\nHiddenServiceDir /var/lib/tor/hidden_service/$nameonion/\nHiddenServiceVersion 3\nHiddenServicePort 80 fronttor:5173" > web/torrc

# # ВАРИАНТ 1. (БЫСТРЫХ НОД/РЕЛЕЕВ)
# # Добавление Entry Nodes
# echo "$(extract_data ReadyTorEntryNodes.json entry)" > web/torrc
# # Добавление Exit Nodes
# echo "$(extract_data ReadyTorExitNodes.json exit)" >> web/torrc
# echo "" >> web/torrc
# echo -e "Log notice file /var/log/tor/notices.log\nLog debug file /var/log/tor/debug.log\nLog info file /var/log/tor/info.log\nHiddenServiceDir /var/lib/tor/hidden_service/$nameonion/\nHiddenServiceVersion 3\nHiddenServicePort 80 fronttor:5173" >> web/torrc

# # ВАРИАНТ 2. (ТОЛЬКО РОССИЯ)
# echo "EntryNodes {ru}" > web/torrc
# echo "ExitNodes {ru}" >> web/torrc
# echo "" >> web/torrc
# echo -e "Log notice file /var/log/tor/notices.log\nLog debug file /var/log/tor/debug.log\nLog info file /var/log/tor/info.log\nHiddenServiceDir /var/lib/tor/hidden_service/$nameonion/\nHiddenServiceVersion 3\nHiddenServicePort 80 fronttor:5173" >> web/torrc
# ==========================================
# ==========================================
# ==========================================



# Очищаем /web/rc.local и заполняем его новым содержимым
echo -e "#!/bin/bash\nchown -R debian-tor:debian-tor /var/lib/tor\nchown debian-tor:debian-tor /var/lib/tor/hidden_service/$nameonion/\nchmod 700 /var/lib/tor/hidden_service/$nameonion/\n/etc/init.d/tor start\n/etc/init.d/nginx start\n" > web/rc.local

# Очищаем папки и копируем файлы и переименовываем их
rm -rf web/nginx/sites-enabled/*
rm -rf web/nginx/sites-available/*

cp tools/templatesnginx/defaultOnionFront web/nginx/sites-enabled/default
cp tools/templatesnginx/defaultOnionFront web/nginx/sites-available/default

# Поиск и замена myonion.onion на $nameonion
sed -i "s/myonion.onion/$nameonion/g" web/nginx/sites-enabled/default
# Поиск и замена myonion.onion на $nameonion
sed -i "s/myonion.onion/$nameonion/g" web/nginx/sites-available/default

rm -f admin/client/vite.config.js
rm -f user/client/vite.config.js

cp tools/viteConfigs/viteConfigOnion.js admin/client/vite.config.js
cp tools/viteConfigs/viteConfigOnion.js user/client/vite.config.js


#----------------------------------------

docker rm -f $(sudo docker ps -aq)
docker rmi -f $(docker images -aq)

# Проверяем существование сети mynetwork
if docker network ls | grep -q 'airbnb_fullpack_mynetwork'; then
    docker network rm airbnb_fullpack_mynetwork
fi

# Проверяем существование сети mynetwork
if docker network ls | grep -q 'airbnb_fullpack_default'; then
    docker network rm airbnb_fullpack_default
fi

# Проверяем существование сети mynetwork
if docker network ls | grep -q 'mynetwork'; then
    docker network rm mynetwork
fi

# Автоматически отвечаем 'y' на вопрос при выполнении docker builder prune
yes | docker builder prune -a

docker compose -f docker-composeOnionFront.yml build --progress=plain
docker compose -f docker-composeOnionFront.yml up --build -d
docker compose logs

end_time=$(date +%s)
elapsed_time=$((end_time - start_time))

echo "Execution time: $elapsed_time seconds"
