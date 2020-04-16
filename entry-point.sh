#!/bin/bash

until nc -z "database" 27017; do
	echo "Waiting for MongoDB";
	sleep 10;
done

npm run build

npm run watch-node