?!/bin/bash

until nc -z "database" 27017; do
	echo "Waiting for MongoDB";
	sleep 10;
done

npm run build-ts

npm run watch-node