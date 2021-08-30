FROM node:14.17.6

RUN mkdir /code
WORKDIR /code

RUN apt-get update
RUN npm install -g nodemon
RUN apt-get install netcat -y
RUN apt-get install -y vim

COPY package*.json ./

RUN npm install

COPY . .

RUN ["chmod", "+x", "/code/entry-point.sh"]
ENTRYPOINT ["/code/entry-point.sh"] 
