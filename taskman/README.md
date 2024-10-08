# GUID

## Runtime

собираем образ

```sh
docker compose build
```


Запускаем контейнер

```sh
docker compose up -d
```

Убиваем контейнер

```sh
docker compose down
```


## API

### set_task

Создать новую таску или обновить существующую в случае когда передан параметр `id` существующей

```sh
curl -XPOST http://taskman:4001/api/download -H 'Content-Type: application/json' -d '{"userId": 1, "url": "https://www.digitalocean.com/community/tutorials/nginx-location-directive", "method": "direct"}'
```

Создание новой задачи

```sh
curl -XPOST http://taskman:4001/api/tasks/set_task -H 'Content-Type: application/json' -d '{"userId": 1, "url": "https://www.digitalocean.com/community/tutorials/nginx-location-directive", "method": "direct"}'
```

Обновление существующей задачи

```sh
curl -XPOST http://taskman:4001/api/tasks/set_task -H 'Content-Type: application/json' -d '{"userId": 1, "url": "https://www.digitalocean.com/community/tutorials/nginx-location-directive", "method": "direct", "id": "604aa78c-f428-11ee-a3d1-74d4351d6119", "status": "DOWNLOADED"}'
```

### get_list

Получить список всех задач

```sh
curl -XGET http://taskman:4001/api/tasks/get_list
```

### rm_task

Удалить таску по переданному `id`

```sh
curl -XPOST http://taskman:4001/api/tasks/rm_task -H 'Content-Type: application/json' -d '{"id": "604aa78c-f428-11ee-a3d1-74d4351d6119"}'
```