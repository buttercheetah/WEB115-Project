# syntax=docker/dockerfile:1

FROM python:3.10.6-bullseye
RUN apt update && apt install -yq wget curl && wget https://downloads.mariadb.com/MariaDB/mariadb_repo_setup && echo "733cf126b03f73050e242102592658913d10829a5bf056ab77e7f864b3f8de1f  mariadb_repo_setup" \
    | sha256sum -c - && chmod +x mariadb_repo_setup
RUN bash ./mariadb_repo_setup --mariadb-server-version="mariadb-10.6"
RUN apt install -yq libmariadb3 libmariadb-dev

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]