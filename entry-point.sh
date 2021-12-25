#!/bin/bash

until nc -z "database" 27017; do
	echo "Waiting for MongoDB";
	sleep 10;
done

export http_proxy=http://devclub.iitd.ac.in:3128/
export https_proxy=http://devclub.iitd.ac.in:3128/

npm run postinstall
npm start
