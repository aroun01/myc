ПЕРЕЧЕНЬ ДЕЙСТВИЙ ДЛЯ РАЗВЕРТЫВАНИЯ / УПРАВЛЕНИЯ СИСТЕМОЙ
/ИНСТРУКЦИЯ К ЭКСПЛУАТАЦИИ/
===========================================================

Система представляет из себя конструктор, позволяющий развернуть функционал на одних и тех же компонентах как в клирнет так и даркнет.

Принцип действия систем таков.
На текущем VPS разместить три типа сборки системы; либо:
1) два домена клирнет (в дальнейшем, в текущем повествовании будем использовать bnbadmin.ru и bnbtest.ru), это действие соответствует Разделу I данного описания;
2) один отдельный домен для даркнета - на админку (в дальнейшем, в текущем повествовании будем использовать air2a2g7suzprjfte7h4hygt22xs6c4jogp7t4lor2sv3tikklteumyd.onion)
3) один отдельный домен для даркнета - на пользовательскую часть (в дальнейшем, в текущем повествовании будем использовать air2bsfjqye2z5mpnwsdinominxwam5zcufqza26336i445fy4c2m5ad.onion).



Опции и настройки по большей части берутся из директории tools. 
Опциональность обеспечивается bash скриптами.
в tools лежат:
- mkp224o - инструмент генерирования ключей для даркнет onion доменов.
- onions - именно сюда необходимо положить результаты генерации mkp224o (см. предыдущий пункт).
- saveimages - папка/хранилище архивов образов докера, образованных запуском bash скрипта shSaveimages.sh
- templatesnginx - настройки для nginx под различные типы сборки системы
- viteConfigs - настройки для nginx под различные типы сборки системы


РАЗДЕЛ I
>>>>>>>>>>>
>>>>>>>>>>>
>>>>>>>>>>>

Если у нас зарегистрированы домены клирнета для:
1) админки (например, bnbadmin.ru)
2) пользовательской части (например, bnbtest.ru)

Ремарка: Важно! Если вы недавно приобрели домены, не стоит в течении первых нескольких часов пробовать получать SSL сертфикаты от Let's Encrypt!
Let's Encrypt может вас за это забанить, ввиду того, что DNS по приобретенным недавно доменам могут быть еще не прописаны/подтверждены ввиду недавней регистрации.

Итак, перед запуском форсирования образов/контейнеров, получаем получаем ssl сертификаты для доменов. Последовательно запускаем :
./getssl.sh bnbadmin.ru
./getssl.sh bnbtest.ru

Должны появиться ключи для каждого из сайтов.
Для bnbadmin.ru, здесь:
/etc/letsencrypt/live/bnbadmin.ru/fullchain.pem
/etc/letsencrypt/live/bnbadmin.ru/privkey.pem
/etc/letsencrypt/archive/bnbadmin.ru/fullchain.pem
/etc/letsencrypt/archive/bnbadmin.ru/privkey.pem

Для bnbtest.ru, здесь:
/etc/letsencrypt/live/bnbtest.ru/fullchain.pem
/etc/letsencrypt/live/bnbtest.ru/privkey.pem
/etc/letsencrypt/archive/bnbtest.ru/fullchain.pem
/etc/letsencrypt/archive/bnbtest.ru/privkey.pem


Скопируйте полученные ключи для bnbadmin.ru в папку /airbnb_fullpack/admin/client/ssl/
Т.е. у вас должно получиться:
/airbnb_fullpack/admin/client/ssl/fullchain.pem
/airbnb_fullpack/admin/client/ssl/privkey.pem


Скопируйте полученные ключи для bnbtest.ru в папку /airbnb_fullpack/user/client/ssl/
Т.е. у вас должно получиться:
/airbnb_fullpack/user/client/ssl/fullchain.pem
/airbnb_fullpack/user/client/ssl/privkey.pem


Запуск сборки системы первого типа (1):
./shSbbtsMain.sh bnbadmin.ru bnbtest.ru

В результате запуска будут: 
- удалены папки node_modules;
- очищены данные по настройкам даркнета (он в первом типе настроек не нужен);
- настроен web/rc.local без параметров даркнета;
- очищены/записаны данные о настройках nginx для первого типа настроек;
- очищены/записаны данные о настройках vite для первого типа настроек;

Время работы скрипта shSbbtsMain.sh составляет примерно 10 минут.

После ввода команды:
docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Names}}"

В результаты должны получить следующий итог:
CONTAINER ID   IMAGE                                                                                NAMES
web               0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   web
back              0.0.0.0:4000->4000/tcp, :::4000->4000/tcp                                  back
redis             0.0.0.0:6379->6379/tcp, :::6379->6379/tcp                                  redis
clientmain        0.0.0.0:5173->5173/tcp, :::5173->5173/tcp                                  clientmain
taskman           0.0.0.0:4001->4001/tcp, :::4001->4001/tcp                                  taskman
frontmain         0.0.0.0:5174->5174/tcp, :::5174->5174/tcp                                  frontmain
filemultiloader   0.0.0.0:8181->8181/tcp, :::8181->8181/tcp                                  filemultiloader

Взаимодействия docker контейнеров производятся в сети mynetwork.

РАЗДЕЛ II и РАЗДЕЛ III
>>>>>>>>>>>
>>>>>>>>>>>
>>>>>>>>>>>
Второй и третий тип сборки системы производятся схожим образом.
Предварительно запускаем:
cd /root/airbnb_fullpack/tools/mkp224o/
Далее, если хотим, чтобы сайт onion  начинался с подстроки 'air', запускаем:
./mkp224o air

Сгенерированные ключи копируем в папку /root/airbnb_fullpack/tools/onions
Размещение домена в сети Тор возможно по нескольким сценариям. Связано это с тем, что некоторые провайдеры / юрисдикции глушат соответствующий трафик. Именно поэтому выбор того или иного сценария развертывания именно на данном VPS в данной юрисдикции определяется путем проб и ошибок. Итак, в текущей реализации данной системы реализовано три сценария:
1) дефолтная; со следуюшим типом контента torrc:

Log notice file /var/log/tor/notices.log
Log debug file /var/log/tor/debug.log
Log info file /var/log/tor/info.log

HiddenServiceDir /var/lib/tor/hidden_service/air2a2g7suzprjfte7h4hygt22xs6c4jogp7t4lor2sv3tikklteumyd.onion/
HiddenServiceVersion 3
HiddenServicePort 80 clienttor:5173

2) поиск быстрых релеев, со следуюшим типом контента torrc:
EntryNodes 188.165.26.13:9100,107.189.8.56:9100,192.184.1.254:9001,178.218.144.99:443,178.170.10.39:9001
ExitNodes 192.42.116.181:9005,192.42.116.174:9004,192.42.116.185:9004,192.42.116.179:9001,192.42.116.217:9003

Log notice file /var/log/tor/notices.log
Log debug file /var/log/tor/debug.log
Log info file /var/log/tor/info.log
HiddenServiceDir /var/lib/tor/hidden_service/air2a2g7suzprjfte7h4hygt22xs6c4jogp7t4lor2sv3tikklteumyd.onion/
HiddenServiceVersion 3
HiddenServicePort 80 clienttor:5173


3) использование релеев определенной юрисдикции, со следуюшим типом контента torrc:
EntryNodes {ru}
ExitNodes {ru}

Log notice file /var/log/tor/notices.log
Log debug file /var/log/tor/debug.log
Log info file /var/log/tor/info.log
HiddenServiceDir /var/lib/tor/hidden_service/air2a2g7suzprjfte7h4hygt22xs6c4jogp7t4lor2sv3tikklteumyd.onion/
HiddenServiceVersion 3
HiddenServicePort 80 clienttor:5173


Выбор варианта сценария определяется в файлах shSbbtsOnionClient.sh shSbbtsOnionFront.sh путем комментирования раздела:

ВАРИАНТЫ НАСТРОЙКИ КОНФИГУРАЦИИ ТОРа.
ВАРИАНТ 0. (ДЕФОЛТ)
ВАРИАНТ 1. (БЫСТРЫХ НОД/РЕЛЕЕВ)
ВАРИАНТ 2. (ТОЛЬКО РОССИЯ)

Если выбран вариант поиска быстрых нод (т.е. релеев) в файлах shSbbtsOnionClient.sh shSbbtsOnionFront.sh, перед запуском данных bash скриптов необходимо найти соответствующие релеи. Их поиск, а затем тестирование на заявленную скорость определяется скриптами shTorSearchNode.py и shTorScanNode.py соответственно.


Поск быстрых релеев с помощью shTorSearchNode.py
-----------------------------------------------------------
Входные параметры:
queryDepth = 500
CountRawTorEntryNodes = 50
CountRawTorExitNodes = 50

Скрипт обращается к ресурсу https://onionoo.torproject.org/ для парсинга/сканирования существующих релеев (с глубиной запроса queryDepth). Полученные данные преобразуются в датасеты. Датасеты имеют характеристики в которых присутствуют:
1) характеристика релея: Entry Node либо Exit Node;
2) IP/Port;
3) скорость релея (bandwidth_rate).

Далее релеи сортируются в соответствие с параметром bandwidth_rate.
Затем формируется выборка из самых быстрых релеев типа Entry Node (с количеством равным параметру CountRawTorEntryNodes) и  из самых быстрых релеев типа Exit Node (с количеством равным параметру CountRawTorExitNodes).

Полученные данные записываются файлы RawTorEntryNodes.json и RawTorExitNodes.json.

 
Сканирование полученных релеев с помощью shTorSearchNode.py
-----------------------------------------------------------
Входные параметры:
WaitingTimeResponseFromNodeSeconds = 20
CountComplited = 4

Релеи записанные в файлы RawTorEntryNodes.json и RawTorExitNodes.json сканируются с помощью nmap на предмет заявленной скорости (возможна ситуация, что декларируемая скорость не соответствует фактической).

Те релеи, которые не имеют подходящего статуса 'open', либо не отвечают в течение WaitingTimeResponseFromNodeSeconds секунд отсеиваются.

В результате формируется список годных релеев, которые записываются в файлы: ReadyTorEntryNodes.json и ReadyTorExitNodes.json.

Именно содержание данных файлов являются источником для формирования файла настроек torrc, когда производится запуск bash скриптов shSbbtsOnionClient.sh shSbbtsOnionFront.sh с исполнением сценария поиска быстрых релеев.

Количество используемых релеев определяется параметром CountComplited. Поскольку нумерация релея начинается с 0, то при значении CountComplited = 4, ориентируемся на пять релеев. По сути shTorSearchNode.py отсекает топ-CountComplited годных релеев.

Активность onion сайтов наступает иногда не сразу, иногда необходимо довольно длительное время и многократные тестирования данной компоненты.


При выполнении команды:
docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Names}}"


ответ на VSP с  air2a2g7suzprjfte7h4hygt22xs6c4jogp7t4lor2sv3tikklteumyd.onion:
IMAGE             PORTS                                       NAMES
web               0.0.0.0:80->80/tcp, :::80->80/tcp           web
back              0.0.0.0:4000->4000/tcp, :::4000->4000/tcp   back
clienttor         0.0.0.0:5173->5173/tcp, :::5173->5173/tcp   clienttor
redis             0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   redis
filemultiloader   0.0.0.0:8181->8181/tcp, :::8181->8181/tcp   filemultiloader
taskman           0.0.0.0:4001->4001/tcp, :::4001->4001/tcp   taskman


ответ на VSP с  air2bsfjqye2z5mpnwsdinominxwam5zcufqza26336i445fy4c2m5ad.onion:
IMAGE             PORTS                                       NAMES
web               0.0.0.0:80->80/tcp, :::80->80/tcp           web
back              0.0.0.0:4000->4000/tcp, :::4000->4000/tcp   back
redis             0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   redis
filemultiloader   0.0.0.0:8181->8181/tcp, :::8181->8181/tcp   filemultiloader
fronttor          0.0.0.0:5173->5173/tcp, :::5173->5173/tcp   fronttor
taskman           0.0.0.0:4001->4001/tcp, :::4001->4001/tcp   taskman


Взаимодействия docker контейнеров производятся в сети mynetwork.

Время работы каждого из скриптов shSbbtsOnionClient.sh и shSbbtsOnionFront.sh составляет примерно 8 минут.



Прозвон tor сети изнутри контейнера
-----------------------------------------------------------
Заходим в контейнер:
docker exec -it web bash

прозванием:
torify curl http://air2a2g7suzprjfte7h4hygt22xs6c4jogp7t4lor2sv3tikklteumyd.onion
torify curl http://air2bsfjqye2z5mpnwsdinominxwam5zcufqza26336i445fy4c2m5ad.onion
torify curl http://a4ygisnerpgtc5ayerl22pll6cls3oyj54qgpm7qrmb66xrxts6y3lyd.onion



Скачивание файлов - контейнеры filemultiloader (Golang) и taskman (Python)
-----------------------------------------------------------
Координация / роутинг скачивания файлов находится в контейнере taskman.
Полная справка по службе taskman находится в файле:
/airbnb_fullpack/taskman/README.md

Сам мультизагрузчик находится в файле контейнере filemultiloader.
Исходники по адресу в контейнере:
/code/main.go
Запуск функционала внутри контейнера:
./filemultiloader
Скрипт самодостаточен. 
Он считывает новые задания на мультизагрузку / удаляет старые задания. 
Запускаем его с периодичностью в несколько (3-5) секунд из cron.

К фронту необходима привязка генерации заданий с помощью taskman (см. его документацию).



Перечень bash скриптов:
-----------------------------------------------------------
1) Скрипты первоначальной сборки:
	/root/airbnb_fullpack/shSbbts.sh
	/root/airbnb_fullpack/shSbbtsOnionClient.sh
	/root/airbnb_fullpack/shSbbtsOnionFront.sh
2) Сохранение архивов по образам докера в папке 'saveimages':
	/root/airbnb_fullpack/shSaveImages.sh
3) Очистка node_modules в каждой из папок:
	/root/airbnb_fullpack/shDeleteNodeModules.sh
4) Очистка папки образов /tools/saveimages:
	/root/airbnb_fullpack/shDeleteImages.sh
5) Восстановление образов докер по архивам сохраненным в папке 'saveimages':
	/root/airbnb_fullpack/shRebuildImages.sh
6) Тулза чистки перечня докер образов от заглушек (докер образов с именованием <none>)
	/root/airbnb_fullpack/shDeletegag.sh


Доп. вопросы / для связи со мной в Telegram: cryptosensors
