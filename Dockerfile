FROM node:latest

RUN mkdir /code
WORKDIR /code
COPY package*.json ./

RUN apt-get update
RUN apt-get install netcat -y
RUN apt-get install -y vim

RUN npm install
COPY . .

RUN ["chmod", "+x", "/code/entry-point.sh"]
ENTRYPOINT ["/code/entry-point.sh"] 