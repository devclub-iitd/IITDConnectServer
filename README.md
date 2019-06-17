# iitd-connect-server API Spec

## JSON Objects returned by API:

### Event

```JSON
{
  "event": {
    "name": "hackathon",
    "about": "campus hackathon",
    "imageLink": "Link For The Image",
    "startDate":"17/06/2019",
    "endDate":"21/06/2019",
    "updates" : [updates],
    "body": "devclub"
  }
}
```

### Body

````JSON
{
  "body": {
    "name": "hackathon",
    "about": "campus hackathon",
    "department": "CSE",
    "events" : [Event]
  }
}

## Endpoints

### Authentication Header

`Authorization: Token jwt.token.here`

### Authentication

`POST /api/users/login`

Example request body:

```JSON
{
  "user":{
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
````

Required fields: `email`, `password`

### Registration:

`POST /api/users`

Example request body:

```JSON
{
  "user":{
    "email": "jake@jake.jake",
    "password": "jakejake",
    "passwordConfirmation":"jakejake",
    "entryNumber":"blahblah"
  }
}
```

Required fields: `email`, `entryNumber`, `password`, `passwordConfirmation`

### Get Current User

`GET /api/users/me`

### Get Profile

`GET /api/users/:id`

### Get The List of Events

`GET /api/events`

### Get The Details About A Particular Event

`GET /api/events/:id`

### Add An Event

`POST /api/events`

Example request body:

```JSON
{
  "user":{
    "name": "hackathon",
    "about":"a short description",
    "body": "devclub",
    "startDate" : "17/06/2019",
    "endDate":"21/06/2019",
  }
}
```

Required fields: `name`, `about`, `body`, `startDate`, `endDate`

### Get The List of Bodies

`GET /api/bodies`

### Get The Details About A Particular Body

`GET /api/bodies/:id`
