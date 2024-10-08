FROM python:3.11-bookworm


WORKDIR /srv
COPY ./main.py /srv/main.py
COPY ./requirements.txt /srv/requirements.txt

RUN pip install -r requirements.txt

ENTRYPOINT ["python", "main.py"]
EXPOSE 4001
