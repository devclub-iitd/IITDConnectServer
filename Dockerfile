FROM node:14.17.6

RUN mkdir /code
WORKDIR /code

RUN apt-get update \
    && npm install -g nodemon \
    && apt-get install -y netcat vim

COPY package*.json ./

RUN npm install

COPY . .

RUN ["chmod", "+x", "/code/entry-point.sh"]
ENTRYPOINT ["/code/entry-point.sh"] 
