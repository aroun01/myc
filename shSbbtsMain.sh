#!/bin/bash

# cd bnbtestru/root/root/airbnb_fullpack
# chmod +x shSbbtsMain.sh

# ./shSbbtsMain.sh bnbadmin.ru bnbtest.ru bnbback.ru


start_time=$(date +%s)

# Принимаем два параметра от пользователя в качестве аргументов командной строки
namedomain0=$1
namedomain1=$2
namedomain2=$3

# Проверяем, введены ли оба параметра
if [ -z "$namedomain0" ] || [ -z "$namedomain1" ] || [ -z "$namedomain2" ]; then
  echo "No data domains!"
  exit 1
fi

echo "Start building BnbTestSystem in Main..."

# Удаляем папки node_modules 
rm -rf admin/client/node_modules
rm -rf user/client/node_modules

rm -rf admin/api/node_modules

rm -rf web/hidden_service/* 

# Очищаем /web/rc.local и заполняем его новым содержимым
echo -e "#!/bin/bash\n/etc/init.d/nginx start" > web/rc.local


# Очищаем папки и копируем файлы и переименовываем их
rm -rf web/nginx/sites-enabled/*
rm -rf web/nginx/sites-available/*

rm -rf admin/client/ssl/*
rm -rf user/client/ssl/*



# cp -r /etc/letsencrypt/archive/$namedomain0/* admin/client/ssl/
# cp -r /etc/letsencrypt/archive/$namedomain1/* user/client/ssl/
# cp -r /etc/letsencrypt/archive/$namedomain2/* admin/api/ssl/


###  aroun0 fix certificate generate

cp /etc/letsencrypt/archive/$namedomain0/fullchain.pem admin/client/ssl/fullchain.pem
cp /etc/letsencrypt/archive/$namedomain1/fullchain1.pem  user/client/ssl/fullchain.pem
cp /etc/letsencrypt/archive/$namedomain2/fullchain1.pem admin/api/ssl/fullchain.pem


cp /etc/letsencrypt/archive/$namedomain0/privkey1.pem admin/client/ssl/privkey.pem
cp /etc/letsencrypt/archive/$namedomain1/privkey1.pem user/client/ssl/privkey.pem
cp /etc/letsencrypt/archive/$namedomain2/privkey1.pem admin/api/ssl/privkey.pem

### 


# cp -r /etc/letsencrypt/live/$namedomain0/* admin/client/ssl/
# cp -r /etc/letsencrypt/live/$namedomain1/* user/client/ssl/
# cp -r /etc/letsencrypt/live/$namedomain2/* admin/api/ssl/

cp tools/templatesnginx/defaultMain web/nginx/sites-enabled/default
cp tools/templatesnginx/defaultMain web/nginx/sites-available/default

# Поиск и замена myclient.ru на $namedomain0
sed -i "s/myclient.ru/$namedomain0/g" web/nginx/sites-enabled/default
sed -i "s/myfront.ru/$namedomain1/g" web/nginx/sites-enabled/default
sed -i "s/myback.ru/$namedomain2/g" web/nginx/sites-enabled/default

sed -i "s/myclient.ru/$namedomain0/g" web/nginx/sites-available/default
sed -i "s/myfront.ru/$namedomain1/g" web/nginx/sites-available/default
sed -i "s/myback.ru/$namedomain2/g" web/nginx/sites-available/default

rm -f admin/client/vite.config.js
rm -f user/client/vite.config.js

cp tools/viteConfigs/viteConfigClient.js admin/client/vite.config.js
cp tools/viteConfigs/viteConfigFront.js user/client/vite.config.js

sed -i "s/myclient.ru/$namedomain0/g" admin/client/vite.config.js
sed -i "s/myfront.ru/$namedomain1/g" user/client/vite.config.js

#---------------------------------------- 
rm admin/api/index.js
sleep 1
cp tools/prototipIndexJs/prototipIndexJs.js admin/api/index.js
sleep 1

sed -i "s/app.listen(4000);/const httpsServer = https.createServer(\n  {\n    key: fs.readFileSync(\"ssl\/privkey.pem\"),\n    cert: fs.readFileSync(\"ssl\/fullchain.pem\"),\n  },\n  app\n);\n\nhttpsServer.listen(4000, () => {\n  console.log(\"HTTPS Server running on port 4000\");\n});/g" admin/api/index.js
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

docker compose -f docker-composeMain.yml build --progress=plain
docker compose -f docker-composeMain.yml up --build -d
docker compose logs

end_time=$(date +%s)
elapsed_time=$((end_time - start_time))

echo "Execution time: $elapsed_time seconds"
