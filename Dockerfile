FROM python:3.8
MAINTAINER Anton Maistrenko

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt

RUN pip install -r requirements.txt

RUN mkdir /app /app/material /app/docker /app/test
WORKDIR /app

CMD ["/app/docker/start.sh"]
