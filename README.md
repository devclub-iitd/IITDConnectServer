<h1>IITD Connect Server</h1>

---

<p align="center">
<img src="https://img.shields.io/badge/node-v14-brightgreen"></img>
<img src="https://img.shields.io/badge/types-Flow%20%7C%20TypeScript-blue"></img>
<img src="https://img.shields.io/badge/firebase--admin-v8.2.0-blue"></img>
<img src="https://img.shields.io/badge/Mongoose-v5.7.5-blue"></img>
<img src="https://img.shields.io/badge/Express-v4.7.1-orange">
<a href="https://github.com/devclub-iitd/IITDConnectServer/graphs/contributors">
<img src="https://img.shields.io/badge/Contributors-5-yellow">
</a>
</p>

## Running The Server Locally On Your System

> 1. Clone The Repo
> 2. Run a local MongoDB server or use atlas mogodb service.
> 3. For development Mode create a .env file int the src folder and place the following in it.
> <code>MONGODB_URI='localhost:27017/dbname' <br>
> PORT=5000</code>
> <br>
> OR
> <br>
> <code>MONGODB_URI='YOUR_ATLAS_CLUSTER_NAME' <br>
> PORT=5000</code>
> 4. run `npm i` inside the project DIR, to install the npm packages.

> 5. Run The Server In Development Mode using `npm run watch-debug`

> 6. View at `localhost:5000`

## API DOCUMENTATION

---

> -To view POSTMAN documentation head over to  [IITD-Connect](https://documenter.getpostman.com/view/11367216/SzmmUEKQ?version=latest)


>
> The API endpoints has been categorized into folders .

 - **User Based**
 -  **Event Based** 
 - **Club/Hostel/Body based**
 - **IITD News Related**
 - **Calendar Related**
 

##  Setting Up
Before Making Any request one should signup and then login . The login request gives back a token which must be used in header before making other request.

 - Extract the token
 - Add it to header of your request , in Authorization field and make it as Bearer Token.
 - This must be done for every request 

## Structure of Admins
---

- Admins can be made with supersuperAdmin as the highest status , and admin as lowest status.
- Below represent the relationship

![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEQ7XG4gICAgc3NhMVsoc3VwZXJzdXBlckFkbWluKV0tLT5zYTFbKHN1cGVyYWRtaW4pXTtcbiAgICBzc2ExWyhzdXBlcnN1cGVyQWRtaW4pXS0tPnNhMlsoc3VwZXJhZG1pbildO1xuICAgIHNzYTFbKHN1cGVyc3VwZXJBZG1pbildLS0-c2EzWyhzdXBlcmFkbWluKV07XG4gICAgc2ExWyhzdXBlckFkbWluIG9mIEJvZHkpXS0tPnNhMWEyWyhhZG1pbildO1xuICAgIHNhMVsoc3VwZXJBZG1pbiBvZiBCb2R5KV0tLT5zYTFhM1soYWRtaW4pXTtcbiAgICBzYTFbKHN1cGVyQWRtaW4gb2YgQm9keSldLS0-c2ExYTRbKGFkbWluKV07XG4gICAgc2EyWyhzdXBlckFkbWluIG9mIEJvZHkpXS0tPnNhMmEyWyhhZG1pbildO1xuICAgIHNhMlsoc3VwZXJBZG1pbiBvZiBCb2R5KV0tLT5zYTJhM1soYWRtaW4pXTtcbiAgICBzYTJbKHN1cGVyQWRtaW4gb2YgQm9keSldLS0-c2EyYTRbKGFkbWluKV07XG4gICAgc2EzWyhzdXBlckFkbWluIG9mIEJvZHkpXS0tPnNhM2EyWyhhZG1pbildO1xuICAgIHNhM1soc3VwZXJBZG1pbiBvZiBCb2R5KV0tLT5zYTNhM1soYWRtaW4pXTtcbiAgICBzYTNbKHN1cGVyQWRtaW4gb2YgQm9keSldLS0-c2EzYTRbKGFkbWluKV07IiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)


## Administrative Powers for Admins
---
Given Below is a structure presently
#### SupersuperAdmin
---

![](https://mermaid.ink/img/eyJjb2RlIjoiXG5ncmFwaCBUQjtcbmlkMShbU3VwZXJTdXBlckFkbWluXSktLT5pZDJbTWFrZSBTdXBlckFkbWlucyBmb3IgYm9kaWVzXTtcbmlkMShbU3VwZXJTdXBlckFkbWluXSktLT5pZDNbQWRkIGEgQm9keV07XG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZm9yZXN0In19)


#### Super Admin
---

![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEI7XG5pZDEoW1N1cGVyIEFkbWluXSktLT5pZDJbTWFrZSBBZG1pbnMgZm9yIHRoZWlyIHJlc3BlY3RpdmUgYm9kaWVzXTtcbmlkMShbU3VwZXIgQWRtaW5dKS0tPmlkM1tVcGRhdGUgY2hhbmdlcyBpbiBCb2RpZXNdO1xuaWQxKFtTdXBlciBBZG1pbl0pLS0-aWQ0W0FkZCBCb2R5IE1lbWJlcnNdO1xuaWQxKFtTdXBlciBBZG1pbl0pLS0-aWQ1W0FkZCBOZXdzICwgbm90IHlldCAsb25seSBhZG1pbnMgY2FuIGRvXTtcbmlkMShbU3VwZXIgQWRtaW5dKS0tPmlkNltBZGQgRXZlbnRzLGF0IHByZXNlbnQgYW55b25lIGNhbiBkb107IiwibWVybWFpZCI6eyJ0aGVtZSI6ImZvcmVzdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)]

#### Admin
---

![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEQ7XG5pZDFbQWRtaW5dLS0-aWQyW0FkZCBOZXdzXTtcbmlkMVtBZG1pbl0tLT5pZDNbQWRkIEV2ZW50cywgYXQgcHJlc2VudCBhbnlvbmUgY2FuIGRvXTsiLCJtZXJtYWlkIjp7InRoZW1lIjoiZm9yZXN0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

## Indices

* [Body/Clubs based](#bodyclubs-based)

  * [Add A Body](#1-add-a-body)
  * [Add body Members](#2-add-body-members)
  * [Get Details of a Body(club/Hostel/Dept)](#3-get-details-of-a-body(clubhosteldept))
  * [Get List of All Bodies](#4-get-list-of-all-bodies)
  * [Toggle Subscribe Option](#5-toggle-subscribe-option)
  * [Update Body](#6-update-body)

* [Calendar-Api](#calendar-api)

  * [Delete reminder](#1-delete-reminder)
  * [Get Reminders](#2-get-reminders)
  * [Get all reminders and Events](#3-get-all-reminders-and-events)
  * [Set Reminder](#4-set-reminder)
  * [Update Reminder](#5-update-reminder)

* [Event Based](#event-based)

  * [Add An Event](#1-add-an-event)
  * [Add An Update](#2-add-an-update)
  * [Delete Event](#3-delete-event)
  * [Delete Update](#4-delete-update)
  * [Get Details About An Event](#5-get-details-about-an-event)
  * [Get List of All Events](#6-get-list-of-all-events)
  * [Update An Event](#7-update-an-event)

* [News -api](#news--api)

  * [Add News](#1-add-news)
  * [Delete News](#2-delete-news)
  * [Get Specific News Details](#3-get-specific-news-details)
  * [Get Trend News](#4-get-trend-news)
  * [Get all News](#5-get-all-news)
  * [Get reported News](#6-get-reported-news)
  * [Report News](#7-report-news)
  * [Update news](#8-update-news)
  * [report news : Toggle visibility](#9-report-news-:-toggle-visibility)

* [TestEndpoints](#testendpoints)

  * [Make me SuperSuperAmin](#1-make-me-supersuperamin)

* [User Based](#user-based)

  * [Add An Admin](#1-add-an-admin)
  * [Add SuperAdmin](#2-add-superadmin)
  * [Get List User starred Events](#3-get-list-user-starred-events)
  * [Get List of Admins](#4-get-list-of-admins)
  * [Logged In User Details](#5-logged-in-user-details)
  * [Remove Admin](#6-remove-admin)
  * [Toggle Star An Event](#7-toggle-star-an-event)


--------


## Body/Clubs based

#### General Schema for Body

---

| Attributes  | Hostel   | club&boards | Hangout Places | Attribute Type                     |
| ----------- | -------- | ----------- | -------------- | ---------------------------------- |
| name        | &#x2611; | &#x2611;    | &#x2611;       | String                             |
| about       | &#x2611; | &#x2611;    | &#x2611;       | String                             |
| caption     | &#x2611; | &#x2611;    | &#x2611;       | String                             |
| events      | &#x2611; | &#x2611;    | &#x2612;       | Array of event document            |
| admins      | &#x2611; | &#x2611;    | &#x2612;       | Array                              |
| superAdmin  | &#x2611; | &#x2611;    | &#x2612;       | mongoode ID                        |
| imageUrl    | &#x2611; | &#x2611;    | &#x2611;       | String                             |
| links       | &#x2611; | &#x2611;    | &#x2612;       | Object of Type Link Schema         |
| typeOfBody  | 0        | 1           | 2              | value in range 0,1,2               |
| members     | &#x2611; | &#x2611;    | &#x2612;       | Array of objects type memberSchema |
| hangoutInfo | &#x2612; | &#x2612;    | &#x2611;       | object of type hangoutSchema       |

#### Hangout Schema

---

1. hangoutInfo is a attribute in body Schema , which is itself an object and has the following Schema
2. hangoutInfo is only used for the Hangout places , i.e typeOfBody:2

| Attributes    | Type   |
| ------------- | ------ |
| contactNumber | Number |
| webUrl        | String |
| gmapsUrl      | String |

#### Links Schema

---

1. links is a attribute in body Schema , which is itself an object and has the following Schema
2. links is used for typeOfBody: 0,1

| Attributes  | Type   |
| ----------- | ------ |
| fbUrl       | String |
| webUrl      | String |
| instaUrl    | String |
| linkedinUrl | String |

#### Members Schema

---

1. members is a attribute in body Schema , which is itself an object and has the following Schema
2. members is used for typeOfBody: 0,1

| Attributes | Type                       |
| ---------- | -------------------------- |
| name       | String                     |
| por        | String                     |
| imgUrl     | String                     |
| link       | object of type linksSchema |



### 1. Add A Body


# Add a Body/Club/Hostel

> Provide the following fields inside body in JSON format/url-encoded
> - name 
> - about
> - department
> - typeOfBody
<br>
> RULES :
> 1.  typeOfBody of body takes value in 0,1,2 . 0:Hostel , 1:Club/Bodies ,2:HangoutPlaces


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{url}}/api/body
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{"name":"DevClub",
  "about":"Technical Club IITD",
  "dept":"CS",
  "typeOfBody":"1"
  
}
```



***More example Requests/Responses:***


##### I. Example Request: Adding Finance club


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzU4Mzg0MGU1ZjE0MDBiMjAwNSIsImlhdCI6MTU3NjMzNDI3OSwiZXhwIjoxNTc2OTM5MDc5fQ.nMVL_FeUqj9-iCrz6jVOZZ1NkCWk3o9PSlcXONjcp6Y |  |
| Content-Type | application/x-www-form-urlencoded |  |



##### I. Example Response: Adding Finance club
```js
{
    "message": "Body Created Successfully",
    "data": {
        "body": {
            "name": "Finance"
        }
    }
}
```


***Status Code:*** 200

<br>



### 2. Add body Members


# Add Body Members
---
- Make a POST request at /api/addMember with body as 
	{"bodyId":"body_id",
		"member":"{object of member Schema}"
	}
- const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  por: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    trim: true,
  },
  link: linksSchema,
});
-   webUrl: {
    type: String,
    trim: true,
  },
  instaUrl: {
    type: String,
    trim: true,
  },
  fbUrl: {
    type: String,
    trim: true,
  },
  linkedinUrl: {
    type: String,
    trim: true,
  },


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{url}}/api/body/addMember
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "bodyId": "5ef8c8ed49c8257d2d47c200",
    "member": {
        "name": "Jaskeerat",
        "por": "House Secretary",
        "imgUrl": "https://www.google.com/images",
        "link": {
            "webUrl": "https://www.jaskeerat.com/lablab",
            "instaUrl": "https://instagram/"
        }
    }
}
```



***More example Requests/Responses:***


##### I. Example Request: Add body Members


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "bodyId": "5ef8c8ed49c8257d2d47c200",
    "member": {
        "name": "Jaskeerat",
        "por": "House Secretary",
        "imgUrl": "https://www.google.com/images",
        "link": {
            "webUrl": "https://www.jaskeerat.com/lablab",
            "instaUrl": "https://instagram/"
        }
    }
}
```



##### I. Example Response: Add body Members
```js
{
    "message": "Sucess",
    "data": {
        "_id": "5efb1472f9e86c023adc5c87",
        "name": "Jaskeerat",
        "por": "House Secretary",
        "imgUrl": "https://www.google.com/images",
        "link": {
            "_id": "5efb1472f9e86c023adc5c88",
            "webUrl": "https://www.jaskeerat.com/lablab",
            "instaUrl": "https://instagram/"
        }
    }
}
```


***Status Code:*** 200

<br>



### 3. Get Details of a Body(club/Hostel/Dept)


# Details of Body
 
- Provide the id of body , as a parameter , to get result for a body desciption.
- GET at /api/body/body_id
- require JWT token authentication


***Endpoint:***

```bash
Method: GET
Type: 
URL: http://localhost:5000/api/body/600dc91a86476f0cfa84f129
```



***More example Requests/Responses:***


##### I. Example Request: Get Details of a Body(club/Hostel/Dept)



##### I. Example Response: Get Details of a Body(club/Hostel/Dept)
```js
{
    "message": "Success",
    "data": {
        "events": [],
        "admins": [],
        "_id": "5ec6a039a3c1605a567ae3f6",
        "name": "Literary Club",
        "about": "We are here to organise events",
        "dept": "ME",
        "createdAt": "2020-05-21T15:37:29.946Z",
        "updatedAt": "2020-06-28T09:32:52.301Z",
        "__v": 0,
        "superAdmin": "5ec2e5aad3e63d114d93359e"
    }
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Get Details of a Body(club/Hostel/Dept)



##### II. Example Response: Get Details of a Body(club/Hostel/Dept)
```js
{
    "message": "Success",
    "data": {
        "events": [],
        "admins": [],
        "_id": "5ef8c8ed49c8257d2d47c200",
        "name": "Satpura Hostel",
        "about": "We are Samurai,we are famous for or mess food",
        "typeOfBody": 0,
        "caption": "Samurai",
        "createdAt": "2020-06-28T16:44:29.243Z",
        "updatedAt": "2020-06-30T10:31:14.242Z",
        "__v": 2,
        "members": [
            {
                "_id": "5efb1472f9e86c023adc5c87",
                "name": "Jaskeerat",
                "por": "House Secretary",
                "imgUrl": "https://www.google.com/images",
                "link": {
                    "_id": "5efb1472f9e86c023adc5c88",
                    "webUrl": "https://www.jaskeerat.com/lablab",
                    "instaUrl": "https://instagram/"
                }
            }
        ],
        "superAdmin": "5ec2e5aad3e63d114d93359e"
    }
}
```


***Status Code:*** 200

<br>



### 4. Get List of All Bodies


## Get List of all bodies
1. get request at /api/body/
2. params accepted is q , which can take value in [0,1,2]
3. 0: Hostel , 1: Clubs & bodies , 2 :HangoutPlaces
4. to get all hostels make get request at /api/body/?q=0
5. If no paramas are provided you get list of all the existing bodies


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/body/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzU4Mzg0MGU1ZjE0MDBiMjAwNSIsImlhdCI6MTU3NjMzNDI3OSwiZXhwIjoxNTc2OTM5MDc5fQ.nMVL_FeUqj9-iCrz6jVOZZ1NkCWk3o9PSlcXONjcp6Y |  |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| q | 1 |  |



***More example Requests/Responses:***


##### I. Example Request: Get List of All Clubs


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzU4Mzg0MGU1ZjE0MDBiMjAwNSIsImlhdCI6MTU3NjMzNDI3OSwiZXhwIjoxNTc2OTM5MDc5fQ.nMVL_FeUqj9-iCrz6jVOZZ1NkCWk3o9PSlcXONjcp6Y |  |



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| q | 0 |  |



##### I. Example Response: Get List of All Clubs
```js
{
    "message": "Success",
    "data": [
        {
            "body": {
                "events": [],
                "admins": [],
                "_id": "5ef8c8ed49c8257d2d47c200",
                "name": "Satpura Hostel",
                "about": "We are Samurai,we are famous for or mess food",
                "typeOfBody": 0,
                "caption": "Samurai",
                "createdAt": "2020-06-28T16:44:29.243Z",
                "updatedAt": "2020-06-28T16:44:29.243Z",
                "__v": 0,
                "members": []
            },
            "isSub": false
        }
    ]
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Get List of All Clubs


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzU4Mzg0MGU1ZjE0MDBiMjAwNSIsImlhdCI6MTU3NjMzNDI3OSwiZXhwIjoxNTc2OTM5MDc5fQ.nMVL_FeUqj9-iCrz6jVOZZ1NkCWk3o9PSlcXONjcp6Y |  |



##### II. Example Response: Get List of All Clubs
```js
{
    "bodies": [
        {
            "name": "Robotics",
            "about": "Build Intelligent Machines",
            "department": "ME",
            "isSub": false,
            "id": "5df4f4e93840e5f1400b2008"
        },
        {
            "name": "Quizzing Club",
            "about": "Quizzing Related Activities In The Campus",
            "department": "BRCA",
            "isSub": true,
            "id": "5df4f4d43840e5f1400b2007"
        },
        {
            "name": "DevClub",
            "about": "Software Development Club",
            "department": "CSE",
            "isSub": false,
            "id": "5df4f4753840e5f1400b2006"
        },
        {
            "name": "Finance",
            "about": "Developing stratigies to invest smartly and wisely with max profir",
            "department": "ME",
            "isSub": false,
            "id": "5eb9418cc7a8d92a4750e8f1"
        },
        {
            "name": "Literary Club",
            "about": "We are here to organise events",
            "department": "ME",
            "isSub": false,
            "id": "5eb944dac7a8d92a4750e8f2"
        }
    ]
}
```


***Status Code:*** 200

<br>



### 5. Toggle Subscribe Option


# Subscribe (Toggle Feature)
- POST at /api/body/body_id/subscribe  
- require Jwt token to be included in the header


***Endpoint:***

```bash
Method: POST
Type: 
URL: http://localhost:5000/api/body/5df4f4d43840e5f1400b2007/subscribe
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzM5Mzg0MGU1ZjE0MDBiMjAwMCIsImlhdCI6MTU3OTQzMTc4NCwiZXhwIjoxNTgwMDM2NTg0fQ.xuuRYS4N_5d5g3nC-lnDRe46B_c3QVzULFgI4DGTmPE |  |



***More example Requests/Responses:***


##### I. Example Request: Example-subscribe


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzM5Mzg0MGU1ZjE0MDBiMjAwMCIsImlhdCI6MTU3OTQzMTc4NCwiZXhwIjoxNTgwMDM2NTg0fQ.xuuRYS4N_5d5g3nC-lnDRe46B_c3QVzULFgI4DGTmPE |  |



##### I. Example Response: Example-subscribe
```js
{
    "message": "Successfully Toggled Subscribe"
}
```


***Status Code:*** 200

<br>



### 6. Update Body


## Update Body
---
1. Only superadmin of bodies are aloowed to update body info.
2. Make a patch request at /api/body/:id


***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: {{url}}/api/body/5ec2e638d3e63d114d93359f
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
	"typeOfBody":1,
	"name":"Devclub"
}
```



***More example Requests/Responses:***


##### I. Example Request: Update Body


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
	"typeOfBody":1,
	"name":"Devclub"
}
```



##### I. Example Response: Update Body
```js
{
    "message": "Sucess",
    "data": {
        "typeOfBody": 1,
        "name": "Devclub"
    }
}
```


***Status Code:*** 200

<br>



## Calendar-Api
# Calendar Schema
---

The following attributes are allowed in a calendar schema

|Attributes|Type|
|---|---|
|createdBy| mongoose.Types.ObjectId|
|name| string|
| description| string|
| startTime| Date Object|
|  endTime| Date Object|
|  venue| string|
|  color| string|
|  repeat| string|
|  eventId| string|
|  reminder| string|
|  participants| Array of String |
|  url| string|

## About
This API contains endpoint to add a custom reminder and also fetch the calendar events between 2 dates



### 1. Delete reminder



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{url}}/api/calendar/reminder/5ec3e4a1986d1b1f233aa6eb
```



***More example Requests/Responses:***


##### I. Example Request: Delete reminder



##### I. Example Response: Delete reminder
```js
{
    "message": "Reminder deleted Successfully",
    "data": {}
}
```


***Status Code:*** 200

<br>



### 2. Get Reminders



***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/calendar/reminder
```



***More example Requests/Responses:***


##### I. Example Request: Get Reminders



##### I. Example Response: Get Reminders
```js
{
    "message": "Successful",
    "data": [
        {
            "_id": "5ec3e4a1986d1b1f233aa6eb",
            "title": "MTL 100 Quiz",
            "startTime": "2020-08-07T08:00:20.000Z",
            "endTime": "2020-08-07T10:00:20.000Z",
            "createdBy": "5ec2e5aad3e63d114d93359e",
            "__v": 0,
            "venue": "LHC 321"
        },
        {
            "_id": "5ef7b28e7685e71996cf7c23",
            "title": "CMP100 Lab Quiz",
            "startTime": "2020-06-07T08:00:20.000Z",
            "endTime": "2020-06-07T10:00:20.000Z",
            "color": "#ffffff",
            "description": "Let rock the CMP quiz",
            "venue": "LHC 101",
            "repeat": "never",
            "createdBy": "5ec2e5aad3e63d114d93359e",
            "__v": 0
        }
    ]
}
```


***Status Code:*** 200

<br>



### 3. Get all reminders and Events


# Get all Events , reminders and stared events 
- POST request at /api/calendar/all
- Authorization token needed
- request body should contain 2 keys  'startTime' and 'endTime' , value of both are date object of javascript in UTC time notation.
- eg of request is {
  "startTime": "2020-08-07T08:00:00.000Z",
  "endTime":"2020-08-07T08:00:30.000Z"

}
- The response contains all event , stared event and reminder between the two times provided
- eg of response is {
    "message": "SuccesFull",
    "data": {
        "reminders": [
            {
                "_id": "5ec3e4a1986d1b1f233aa6eb",
                "title": "MTL 100 Quiz",
                "startTime": "2020-08-07T08:00:20.000Z",
                "endTime": "2020-08-07T10:00:20.000Z",
                "createdBy": "5ec2e5aad3e63d114d93359e",
                "venue": "LHC 321"
            }
        ],
        "staredEvents": [
            {
                "_id": "5ec6a078a3c1605a567ae3f7",
                "name": "Code Night",
                "startDate": "2020-08-07T08:00:20.000Z",
                "endDate": "2020-08-07T10:00:20.000Z",
                "topicName": "Code-Night-jhtn52"
            }
        ],
        "event": [
            {
                "_id": "5ec6a078a3c1605a567ae3f7",
                "name": "Code Night",
                "startDate": "2020-08-07T08:00:20.000Z",
                "endDate": "2020-08-07T10:00:20.000Z",
                "topicName": "Code-Night-jhtn52"
            }
        ]
    }
}


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{url}}/api/calendar/all
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
  "startTime": "2020-08-07T08:00:00.000Z",
  "endTime":"2020-08-07T08:00:30.000Z"

}
```



***More example Requests/Responses:***


##### I. Example Request: Get all reminders and Events


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
  "startTime": "2020-08-07T08:00:00.000Z",
  "endTime":"2020-08-07T08:00:30.000Z"

}
```



##### I. Example Response: Get all reminders and Events
```js
{
    "message": "SuccesFull",
    "data": {
        "reminders": [
            {
                "_id": "5ec3e4a1986d1b1f233aa6eb",
                "title": "MTL 100 Quiz",
                "startTime": "2020-08-07T08:00:20.000Z",
                "endTime": "2020-08-07T10:00:20.000Z",
                "createdBy": "5ec2e5aad3e63d114d93359e",
                "venue": "LHC 321"
            },
            {
                "_id": "5ef7b28e7685e71996cf7c23",
                "title": "CMP100 Lab Quiz",
                "startTime": "2020-06-07T08:00:20.000Z",
                "endTime": "2020-06-07T10:00:20.000Z",
                "color": "#ffffff",
                "description": "Let rock the CMP quiz",
                "venue": "LHC 102",
                "repeat": "never",
                "createdBy": "5ec2e5aad3e63d114d93359e"
            }
        ],
        "staredEvents": [],
        "event": [
            {
                "_id": "5ecea450e97f9511dfe412ff",
                "name": "Code Night",
                "startDate": "2020-08-07T08:00:20.000Z",
                "endDate": "2020-08-07T10:00:20.000Z",
                "topicName": "Code-Night-46li58"
            },
            {
                "_id": "5ecea4b5e97f9511dfe41300",
                "name": "Drama 2020",
                "startDate": "2020-08-07T08:00:20.000Z",
                "endDate": "2020-08-07T10:00:20.000Z",
                "topicName": "Drama-2020-hv4f6c"
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



### 4. Set Reminder



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{url}}/api/calendar/reminder
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
 { 
 	"title":"CMP100 Lab Quiz",
 	"startTime": "2020-06-07T08:00:20.000Z",
  "endTime": "2020-06-07T10:00:20.000Z",
  "color":"#ffffff",
  "description":"Let rock the CMP quiz",
  "venue":"LHC 101",
  "repeat":"never",
  "reminder":"Here comes the reminder string"
  }
```



***More example Requests/Responses:***


##### I. Example Request: Set Reminder


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
 { 
 	"title":"CMP100 Lab Quiz",
 	"startTime": "2020-06-07T08:00:20.000Z",
  "endTime": "2020-06-07T10:00:20.000Z",
  "color":"#ffffff",
  "description":"Let rock the CMP quiz",
  "venue":"LHC 101",
  "repeat":"never",
  "reminder":"Here comes the reminder string"
  }
```



##### I. Example Response: Set Reminder
```js
{
    "message": "Reminder Added Succesfully",
    "data": {
        "_id": "5ef7b28e7685e71996cf7c23",
        "title": "CMP100 Lab Quiz",
        "startTime": "2020-06-07T08:00:20.000Z",
        "endTime": "2020-06-07T10:00:20.000Z",
        "color": "#ffffff",
        "description": "Let rock the CMP quiz",
        "venue": "LHC 101",
        "repeat": "never",
        "createdBy": "5ec2e5aad3e63d114d93359e",
        "__v": 0
    }
}
```


***Status Code:*** 200

<br>



### 5. Update Reminder



***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: {{url}}/api/calendar/reminder/5ec3e4a1986d1b1f233aa6eb
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
	"title":"MTL 100 Quiz",
	"venue":"LHC 321"
}
```



***More example Requests/Responses:***


##### I. Example Request: Update Reminder


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
	
	"venue":"LHC 102"
}
```



##### I. Example Response: Update Reminder
```js
{
    "message": "Update Successfull",
    "data": {
        "_id": "5ef7b28e7685e71996cf7c23",
        "venue": "LHC 101"
    }
}
```


***Status Code:*** 200

<br>



## Event Based
# Events Schema
---

The below are available fields for the events Schema

| Attributes | Type |
|---|---|
|name| string|
|createdBy| mongoose.Types.ObjectId|
|about| string|
|body| mongoose.Types.ObjectId|
|startDate| Date|
|endDate| Date|
|participants| mongoose.Types.ObjectId[]|
|venue| string|
|imageLink| string|
|updates| mongoose.Types.ObjectId[]|
|topicName| string|
|official_inti_event| boolean|
|color| string|
|eventId| string|



### 1. Add An Event



***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: http://localhost:5000/api/events/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| name | Drama 2020 |  |
| about | For all IIt delhi students |  |
| venue | Bharti Building |  |
| body | 5ec2e638d3e63d114d93359f |  |
| startDate | 2020-08-07T08:00:20.000Z |  |
| endDate | 2020-08-07T10:00:20.000Z |  |



### 2. Add An Update



***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: http://localhost:5000/api/events/5df489e3c34a83df8ee27011/addUpdate
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjIxMjJkYzFmMDcxNzg1NGUwMWJhZiIsImlhdCI6MTU3NjI1ODU2OSwiZXhwIjoxNTc2ODYzMzY5fQ.ZpKaksZxRF4g8C8-FgDk32cL_EHESRFa2QpaF-S7kYI |  |
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| body | Event Finally Cancelled |  |
| title | Cancel Hi Kardiya |  |



### 3. Delete Event



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://localhost:5000/api/events/5ec6a078a3c1605a567ae3f7
```



***More example Requests/Responses:***


##### I. Example Request: Delete Event


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjIxMjJkYzFmMDcxNzg1NGUwMWJhZiIsImlhdCI6MTU3NjE3ODkxMCwiZXhwIjoxNTc2NzgzNzEwfQ.e66flrNcVRKG055KdTnjDcoMqCKMnq_K1rpHHsakZcc |  |



##### I. Example Response: Delete Event
```js
Event Was Successfully Removed
```


***Status Code:*** 200

<br>



### 4. Delete Update



***Endpoint:***

```bash
Method: DELETE
Type: URLENCODED
URL: http://localhost:5000/api/events/5df21b3415f7de7ad2129449/removeUpdate
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjIxMjJkYzFmMDcxNzg1NGUwMWJhZiIsImlhdCI6MTU3NjI1ODU2OSwiZXhwIjoxNTc2ODYzMzY5fQ.ZpKaksZxRF4g8C8-FgDk32cL_EHESRFa2QpaF-S7kYI |  |
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| updateId | 5df3dfdc9b67df11d9238c7d |  |



### 5. Get Details About An Event



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://localhost:5000/api/events/5df50dbf54fad33b476f6a84
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzRkMzg0MGU1ZjE0MDBiMjAwNCIsImlhdCI6MTU3NzE2NTU3NCwiZXhwIjoxNTc3NzcwMzc0fQ.vMGWv0zYupmh10uwTJ6dzNYKt_9rcJd-uvDO5p-v_8o |  |



***More example Requests/Responses:***


##### I. Example Request: Details of event in Devclub


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzRkMzg0MGU1ZjE0MDBiMjAwNCIsImlhdCI6MTU3NzE2NTU3NCwiZXhwIjoxNTc3NzcwMzc0fQ.vMGWv0zYupmh10uwTJ6dzNYKt_9rcJd-uvDO5p-v_8o |  |



##### I. Example Response: Details of event in Devclub
```js
{
    "event": {
        "id": "5df50dbf54fad33b476f6a84",
        "name": "Orientation",
        "about": "get educated in dark arts",
        "body": {
            "name": "DevClub",
            "about": "Software Development Club",
            "id": "5df4f4753840e5f1400b2006",
            "department": "CSE",
            "isSub": false
        },
        "startDate": "2019-12-24T10:58:00.000Z",
        "endDate": "2019-12-26T16:28:00.000Z",
        "stared": false,
        "image": "",
        "venue": "LH-316",
        "updates": [
            {
                "_id": "5e1620b8cc86eb200dd19ec6",
                "body": "Notification check",
                "title": "check one",
                "createdAt": "2020-01-08T18:34:32.510Z",
                "updatedAt": "2020-01-08T18:34:32.510Z",
                "__v": 0
            },
            {
                "_id": "5e1620bccc86eb200dd19ec7",
                "body": "Notification check",
                "title": "check one",
                "createdAt": "2020-01-08T18:34:36.822Z",
                "updatedAt": "2020-01-08T18:34:36.822Z",
                "__v": 0
            },
            {
                "_id": "5e1620c2cc86eb200dd19ec8",
                "body": "Notification check",
                "title": "check one",
                "createdAt": "2020-01-08T18:34:42.332Z",
                "updatedAt": "2020-01-08T18:34:42.332Z",
                "__v": 0
            },
            {
                "_id": "5e1c593be69cc08bc58c4520",
                "body": "Notification check",
                "title": "check two",
                "createdAt": "2020-01-13T11:49:15.175Z",
                "updatedAt": "2020-01-13T11:49:15.175Z",
                "__v": 0
            },
            {
                "_id": "5e1c5978e69cc08bc58c4521",
                "body": "Notification check",
                "title": "check three",
                "createdAt": "2020-01-13T11:50:16.892Z",
                "updatedAt": "2020-01-13T11:50:16.892Z",
                "__v": 0
            },
            {
                "_id": "5e1c6e7c16c6bc9935e7121b",
                "body": "Notification check",
                "title": "Brand New",
                "createdAt": "2020-01-13T13:19:56.298Z",
                "updatedAt": "2020-01-13T13:19:56.298Z",
                "__v": 0
            },
            {
                "_id": "5e1c6eba4e467199729b9dc1",
                "body": "Notification check",
                "title": "Brand New",
                "createdAt": "2020-01-13T13:20:58.048Z",
                "updatedAt": "2020-01-13T13:20:58.048Z",
                "__v": 0
            },
            {
                "_id": "5e1c6f2a4e467199729b9dc2",
                "body": "Notification check",
                "title": "Brand New",
                "createdAt": "2020-01-13T13:22:50.123Z",
                "updatedAt": "2020-01-13T13:22:50.123Z",
                "__v": 0
            },
            {
                "_id": "5e987965780bd9580b289ea7",
                "body": "Event Finally Cancelled",
                "title": "Cancel Hi Kardiya",
                "createdAt": "2020-04-16T15:27:33.835Z",
                "updatedAt": "2020-04-16T15:27:33.835Z",
                "__v": 0
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



### 6. Get List of All Events



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://localhost:5000/api/events/
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzRkMzg0MGU1ZjE0MDBiMjAwNCIsImlhdCI6MTU3NzE2NTU3NCwiZXhwIjoxNTc3NzcwMzc0fQ.vMGWv0zYupmh10uwTJ6dzNYKt_9rcJd-uvDO5p-v_8o |  |



### 7. Update An Event



***Endpoint:***

```bash
Method: PUT
Type: URLENCODED
URL: http://localhost:5000/api/events/5df3e9d1412da31ca986d94f
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjIxMjJkYzFmMDcxNzg1NGUwMWJhZiIsImlhdCI6MTU3NjI1ODU2OSwiZXhwIjoxNTc2ODYzMzY5fQ.ZpKaksZxRF4g8C8-FgDk32cL_EHESRFa2QpaF-S7kYI |  |
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| venue | No Fucking Venue |  |
| about | YES GO GET THEM |  |



## News -api
# News Schema
---

The following Attributes are allowed in the news Schema

|Attributes|Type|
|---|---|
  |sourceName| string|
  |sourceUrl| string|
  |createdBy| mongoose.Types.ObjectId|
  |author| string|
  |title| string|
  |description| string|
  |imgUrl| string|
  |publDate| Date|
  |content| string|
  |clicks| number|
  |reports| Array of objects of type reportSchema|
  |visible| boolean|


### ReportSchema
---
1. reports is an attribute in the news Schema , which itself is an array of objects of type reportSchema
2. The reportSchema is defined as following

|Attributes|Type|
|---|---|
|description|String|
|reporter|mongoose Id|
|date|Date object|

## News Visibility
---
- All reported news are reviewed by the admins. So before deleting the news , he can temporarily hide the news , so to review it later . If news found to be abusive , he can delete , else he can unhide it again.
- Also when an api call to fetch news is made , only the news with {visible:true} are send from api



[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggTFI7XG5pZDFbKERhdGFiYXNlKV0tLT5pZDIoW0FQSV0pO1xuaWQyKFtBUEldKS0tPiB8VmlzaWJsZSBzdGF0dXMgTmV3c3xpZDNbVXNlcl07XG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZm9yZXN0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)])



### 1. Add News


# Add News 
- POST at /api/news/:id
- Include the news in json format in the body
- Only admins can add a news



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{url}}/api/news
```



***Body:***

```js        
{
	"description":"Pay your fucking fees",
	"title":"Fees Deadline Till 8 FEB",
	"content":"Student are requested to pay their fees by 8 feb",
	"sourceName":"IITD administration",
	"author":"lolarmy"
}
```



***More example Requests/Responses:***


##### I. Example Request: Adding News example(provide authorization Token in header)


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
	"description":"Corona has spread all over the world",
	"title":"Fighting corona cannot be done much longer",
	"content":"IIT delhi has its third case of corona",
	"sourceName":"Zee-News",
	"author":"Ayush"
}
```



##### I. Example Response: Adding News example(provide authorization Token in header)
```js
{
    "message": "News added Successfully",
    "data": {
        "clicks": 0,
        "_id": "5ec2e828d3e63d114d9335a3",
        "description": "Corona has spread all over the world",
        "content": "IIT delhi has its third case of corona",
        "sourceName": "Zee-News",
        "author": "Ayush",
        "createdBy": "5ec2e5aad3e63d114d93359e",
        "publDate": "2020-05-18T19:55:20.878Z",
        "reports": [],
        "createdAt": "2020-05-18T19:55:20.879Z",
        "updatedAt": "2020-05-18T19:55:20.879Z",
        "__v": 0
    }
}
```


***Status Code:*** 200

<br>



### 2. Delete News


# Delete News
- delete request at /api/news/:id
- id : news id 
- require admin status to delete the news


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{url}}/api/news/5ebfcf0b440fd226fab48ba6
```



### 3. Get Specific News Details


# Get News Details
- Get at /api/news/:id


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/news/600ee5e64ca82023bf3790fa
```



***More example Requests/Responses:***


##### I. Example Request: Get Specific News Details



##### I. Example Response: Get Specific News Details
```js
{
    "clicks": 3,
    "_id": "5ec2e809d3e63d114d9335a2",
    "description": "Corona has spread all over the world",
    "content": "IIT delhi has its second case of corona",
    "sourceName": "Aaj-tak",
    "author": "Aranya",
    "createdBy": "5ec2e5aad3e63d114d93359e",
    "publDate": "2020-05-18T19:54:49.619Z",
    "reports": [],
    "createdAt": "2020-05-18T19:54:49.620Z",
    "updatedAt": "2020-05-18T20:29:50.852Z",
    "__v": 0
}
```


***Status Code:*** 200

<br>



### 4. Get Trend News


> - To get the trending news make a get request at /api/news/trend
> - It also support the limit quesry i.e /api/news/?trend=10 , will fetch top 10 trending news .


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/news/trend/
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| limit | 10 |  |



### 5. Get all News


## Get all News
- Get request at /api/news/
- Following query string are supported 
-- 1.limit=[arg] : will display [arg] number of documents
-- 2.skip=[arg] : will skip the [arg] number of documents
-- 3.sortBy=[fieldname]:[desc|asc]
-- By default sorting take place in ascending order

## Examples of Get request
- 1.Get the trending news
--  GET /api/news/?sortBy=clicks:desc


- 2.Get last 15  Recent news
--  GET /api/news/?limit=15&sortBy=createdAt:desc

- 3.Pagination : Suppose you can show only 10 news in a page , to load news for second page do
--  Get api/news/?limit=10&skip=10


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/news/
```



***More example Requests/Responses:***


##### I. Example Request: Get Trending News



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| sortBy | clicks:desc |  |



##### I. Example Response: Get Trending News
```js
[
    {
        "clicks": 5,
        "_id": "5ec2e7d9d3e63d114d9335a1",
        "description": "Corona has spread all over the world",
        "sourceName": "ABP",
        "author": "Jaskeerat",
        "createdAt": "2020-05-18T19:54:01.633Z"
    },
    {
        "clicks": 3,
        "_id": "5ec2e809d3e63d114d9335a2",
        "description": "Corona has spread all over the world",
        "sourceName": "Aaj-tak",
        "author": "Aranya",
        "createdAt": "2020-05-18T19:54:49.620Z"
    },
    {
        "clicks": 0,
        "_id": "5ec2e828d3e63d114d9335a3",
        "description": "Corona has spread all over the world",
        "sourceName": "Zee-News",
        "author": "Ayush",
        "createdAt": "2020-05-18T19:55:20.879Z"
    }
]
```


***Status Code:*** 200

<br>



##### II. Example Request: Get Recent News 



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| sortBy | createdAt:desc |  |



##### II. Example Response: Get Recent News 
```js
[
    {
        "clicks": 0,
        "_id": "5ec2e828d3e63d114d9335a3",
        "description": "Corona has spread all over the world",
        "sourceName": "Zee-News",
        "author": "Ayush",
        "createdAt": "2020-05-18T19:55:20.879Z"
    },
    {
        "clicks": 0,
        "_id": "5ec2e809d3e63d114d9335a2",
        "description": "Corona has spread all over the world",
        "sourceName": "Aaj-tak",
        "author": "Aranya",
        "createdAt": "2020-05-18T19:54:49.620Z"
    },
    {
        "clicks": 0,
        "_id": "5ec2e7d9d3e63d114d9335a1",
        "description": "Corona has spread all over the world",
        "sourceName": "ABP",
        "author": "Jaskeerat",
        "createdAt": "2020-05-18T19:54:01.633Z"
    }
]
```


***Status Code:*** 200

<br>



### 6. Get reported News


## Get Reported
- only admin can see all the reported news
- this api endpoint gives all reported news
- Make get request at /api/news/report/all


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/news/report/all
```



***More example Requests/Responses:***


##### I. Example Request: Get reported News



##### I. Example Response: Get reported News
```js
{
    "message": "Reported News",
    "data": [
        {
            "clicks": 0,
            "visible": true,
            "_id": "5ec2e828d3e63d114d9335a3",
            "description": "Corona has spread all over the world",
            "content": "IIT delhi has its third case of corona",
            "sourceName": "Zee-News",
            "author": "Ayush",
            "createdBy": "5ec2e5aad3e63d114d93359e",
            "publDate": "2020-05-18T19:55:20.878Z",
            "reports": [
                {
                    "date": "2020-06-28T00:37:13.529Z",
                    "_id": "5ef7e6392a6e233cafc07b4c",
                    "description": "The above news is Fake",
                    "reporter": "5ec2e5aad3e63d114d93359e"
                }
            ],
            "createdAt": "2020-05-18T19:55:20.879Z",
            "updatedAt": "2020-06-28T00:37:13.543Z",
            "__v": 1
        }
    ]
}
```


***Status Code:*** 200

<br>



### 7. Report News


# Report News
- Post request at /api/news/report/:id


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{url}}/api/news/report/5ec2e828d3e63d114d9335a3
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
	"description":"The above news is Fake"
}
```



***More example Requests/Responses:***


##### I. Example Request: Report News


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
	"description":"The above news is Fake"
}
```



##### I. Example Response: Report News
```js
{
    "message": "Report issued successfully",
    "data": {
        "description": "The above news is Fake",
        "reporter": "5ec2e5aad3e63d114d93359e"
    }
}
```


***Status Code:*** 200

<br>



### 8. Update news


# Update news
- Patch at /api/news/:id
- id:news id
- only admin are allowed to update the news
- allowed fields : ['sourceName','sourceUrl','title','author','description','imgUrl','content'];


***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: {{url}}/api/news/5ec2e828d3e63d114d9335a3
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
"visible":"false"
  
}
```



### 9. report news : Toggle visibility


## Toggle Visibility of news
- A news can be made unvisible by admins , if they cause reports.
- so admin can hide news without deleting it for a while
- this can be done by this api endpoint
- Only admins can do ,
- Make get request at /api/news/report/toggle/:_id


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/news/report/toggle/5ec2e828d3e63d114d9335a3
```



***More example Requests/Responses:***


##### I. Example Request: report news : Toggle visibility



##### I. Example Response: report news : Toggle visibility
```js
{
    "message": "succefull",
    "data": {
        "visibleStatus": false
    }
}
```


***Status Code:*** 200

<br>



## TestEndpoints
This contains List of Testing Enpoints for the development purpose



### 1. Make me SuperSuperAmin


## Make me superSuperAdmin

- superSuperAdmin is a status 
- Only supersuperadmin can make a user superAdmin for a Body
- then the superadmin can make admins for his body
- supersuperadmin: Director
- superadmin: HOD
- admin : Proff


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/testEndpoint/makeMeSuperSuperAdmin
```



***More example Requests/Responses:***


##### I. Example Request: Make me SuperSuperAmin



##### I. Example Response: Make me SuperSuperAmin
```js
{
    "message": "SuperSuperadmin made Succesfully",
    "data": {
        "superAdminStatus": true
    }
}
```


***Status Code:*** 200

<br>



## User Based

# User Schema
---

The following are the attributes available for User Schema

| Attributes | Type |
|---|---|
| name| string|
|password| string|
|privilege| string|
|subscribedBodies| mongoose.Types.ObjectId[]|
|canCreate| boolean|
|createdEvents| mongoose.Types.ObjectId[]|
|staredEvents| mongoose.Types.ObjectId[]|
|iitdEmail| string|
|emailValidated| boolean|
|facebookID| string|
|googleID| string|
|entryNumber| string|
|department| string|
|fcmRegistrationToken| string|
|adminOf| mongoose.Types.ObjectId[]|
|email| string|
|superSuperAdmin| boolean|
|superAdminOf| mongoose.Types.ObjectId[]|



### 1. Add An Admin


## Adding an Admin
---
1. Admins can only be added by a superadmin of the club
2. There can be many admins to a club
3. To make a admin : a superadmin must make a POST request at  /api/users/addAdmin and in body provide the {clubid, userEmail}, userEmail is mail of user you want to make admin


***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: http://localhost:5000/api/users/addAdmin
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 600dc91a86476f0cfa84f129 |  |
| userEmail | ee1180494@ee.iitd.ac.in |  |



***More example Requests/Responses:***


##### I. Example Request: Add An Admin


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 5ec6a039a3c1605a567ae3f6 |  |
| userEmail | dev2@gmail.com |  |



##### I. Example Response: Add An Admin
```js
{
    "message": "Admin Added Succesfully",
    "data": {
        "bodyId": "5ec6a039a3c1605a567ae3f6",
        "userId": "5ef867f538c52658f4d2d905"
    }
}
```


***Status Code:*** 200

<br>



### 2. Add SuperAdmin


## Add SuperAdmin
1. A superAdmin can only be added by a user of status supersuperadmin
2. A body can have only single Super admin , but multiple admins , which are added by super admin
3. Make POST request at /api/users/addSuperAdmin  and in body provide the {clubid , userEmail}. {userEmail} is the email of user you want to make admin


***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: {{url}}/api/users/addSuperAdmin
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 600dc91a86476f0cfa84f129 |  |
| userEmail | mt6190752@maths.iitd.ac.in |  |



***More example Requests/Responses:***


##### I. Example Request: Add SuperAdmin


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 5ec6a039a3c1605a567ae3f6 |  |
| userEmail | dev@gmail.com |  |



##### I. Example Response: Add SuperAdmin
```js
{
    "message": "Success",
    "data": {
        "body": {
            "events": [],
            "admins": [],
            "_id": "5ec6a039a3c1605a567ae3f6",
            "name": "Literary Club",
            "about": "We are here to organise events",
            "dept": "ME",
            "createdAt": "2020-05-21T15:37:29.946Z",
            "updatedAt": "2020-06-28T09:32:52.301Z",
            "__v": 0,
            "superAdmin": "5ec2e5aad3e63d114d93359e"
        },
        "superAdmin": {
            "emailValidated": false,
            "superSuperAdmin": true,
            "subscribedBodies": [],
            "canCreate": false,
            "createdEvents": [],
            "staredEvents": [
                "5ec6a078a3c1605a567ae3f7"
            ],
            "adminOf": [
                "5ec2e638d3e63d114d93359f"
            ],
            "superAdminOf": [
                "5ec2e638d3e63d114d93359f",
                "5ec2e638d3e63d114d93359f",
                "5ec6a039a3c1605a567ae3f6",
                "5ec6a039a3c1605a567ae3f6"
            ],
            "_id": "5ec2e5aad3e63d114d93359e",
            "email": "dev@gmail.com",
            "password": "$2a$10$NOh/CHqTr9CMQ.Ny0qnkzOXnpLBEwD9n6nXNOGt.z7bgzyAwHY1..",
            "createdAt": "2020-05-18T19:44:42.205Z",
            "updatedAt": "2020-06-28T09:40:26.018Z",
            "__v": 5
        }
    }
}
```


***Status Code:*** 200

<br>



### 3. Get List User starred Events


# List Of events
- Just provide jwt token as bearer token in header
- GET request at /api/events/


***Endpoint:***

```bash
Method: GET
Type: 
URL: http://localhost:5000/api/events/
```



***More example Requests/Responses:***


##### I. Example Request: Get List of Events


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjRmMzM5Mzg0MGU1ZjE0MDBiMjAwMCIsImlhdCI6MTU4OTE5MTk3OSwiZXhwIjoxNTg5Nzk2Nzc5fQ.PYHSLOe6_M9n4_PjppN-QsTbJRuOCsejcikknVSi_-U |  |



##### I. Example Response: Get List of Events
```js
{
    "message": "Events Found",
    "data": {
        "events": [
            {
                "id": "5df50dbf54fad33b476f6a84",
                "name": "Orientation",
                "about": "get educated in dark arts",
                "body": {
                    "name": "DevClub",
                    "about": "Software Development Club",
                    "id": "5df4f4753840e5f1400b2006",
                    "department": "CSE",
                    "isSub": false
                },
                "startDate": "2019-12-24T10:58:00.000Z",
                "endDate": "2019-12-26T16:28:00.000Z",
                "stared": false,
                "image": "",
                "venue": "LH-316",
                "updates": [
                    {
                        "_id": "5e1620b8cc86eb200dd19ec6",
                        "body": "Notification check",
                        "title": "check one",
                        "createdAt": "2020-01-08T18:34:32.510Z",
                        "updatedAt": "2020-01-08T18:34:32.510Z",
                        "__v": 0
                    },
                    {
                        "_id": "5e1620bccc86eb200dd19ec7",
                        "body": "Notification check",
                        "title": "check one",
                        "createdAt": "2020-01-08T18:34:36.822Z",
                        "updatedAt": "2020-01-08T18:34:36.822Z",
                        "__v": 0
                    },
                    {
                        "_id": "5e1620c2cc86eb200dd19ec8",
                        "body": "Notification check",
                        "title": "check one",
                        "createdAt": "2020-01-08T18:34:42.332Z",
                        "updatedAt": "2020-01-08T18:34:42.332Z",
                        "__v": 0
                    },
                    {
                        "_id": "5e1c593be69cc08bc58c4520",
                        "body": "Notification check",
                        "title": "check two",
                        "createdAt": "2020-01-13T11:49:15.175Z",
                        "updatedAt": "2020-01-13T11:49:15.175Z",
                        "__v": 0
                    },
                    {
                        "_id": "5e1c5978e69cc08bc58c4521",
                        "body": "Notification check",
                        "title": "check three",
                        "createdAt": "2020-01-13T11:50:16.892Z",
                        "updatedAt": "2020-01-13T11:50:16.892Z",
                        "__v": 0
                    },
                    {
                        "_id": "5e1c6e7c16c6bc9935e7121b",
                        "body": "Notification check",
                        "title": "Brand New",
                        "createdAt": "2020-01-13T13:19:56.298Z",
                        "updatedAt": "2020-01-13T13:19:56.298Z",
                        "__v": 0
                    },
                    {
                        "_id": "5e1c6eba4e467199729b9dc1",
                        "body": "Notification check",
                        "title": "Brand New",
                        "createdAt": "2020-01-13T13:20:58.048Z",
                        "updatedAt": "2020-01-13T13:20:58.048Z",
                        "__v": 0
                    },
                    {
                        "_id": "5e1c6f2a4e467199729b9dc2",
                        "body": "Notification check",
                        "title": "Brand New",
                        "createdAt": "2020-01-13T13:22:50.123Z",
                        "updatedAt": "2020-01-13T13:22:50.123Z",
                        "__v": 0
                    },
                    {
                        "_id": "5e987965780bd9580b289ea7",
                        "body": "Event Finally Cancelled",
                        "title": "Cancel Hi Kardiya",
                        "createdAt": "2020-04-16T15:27:33.835Z",
                        "updatedAt": "2020-04-16T15:27:33.835Z",
                        "__v": 0
                    }
                ]
            },
            {
                "id": "5df5397a54fad33b476f6a8e",
                "name": "Hackathon",
                "about": "Make Something Good",
                "body": {
                    "name": "DevClub",
                    "about": "Software Development Club",
                    "id": "5df4f4753840e5f1400b2006",
                    "department": "CSE",
                    "isSub": false
                },
                "startDate": "2019-12-24T14:05:00.000Z",
                "endDate": "2019-12-25T14:05:00.000Z",
                "stared": false,
                "image": "",
                "venue": "LH-121",
                "updates": []
            },
            {
                "id": "5df539af54fad33b476f6a8f",
                "name": "Build A Robot",
                "about": "Don't you ever wonder what is it like to make your own robots? Come and make your own robots in this event. You will learn a lot from your seniors. Participants from all the years are welcome.",
                "body": {
                    "name": "Robotics",
                    "about": "Build Intelligent Machines",
                    "id": "5df4f4e93840e5f1400b2008",
                    "department": "ME",
                    "isSub": false
                },
                "startDate": "2019-12-24T11:30:00.000Z",
                "endDate": "2019-12-24T13:30:00.000Z",
                "stared": false,
                "image": "",
                "venue": "LH-325",
                "updates": [
                    {
                        "_id": "5df53a3754fad33b476f6a91",
                        "title": "TITLE",
                        "body": "All the material will be provided",
                        "createdAt": "2019-12-14T19:38:31.874Z",
                        "updatedAt": "2019-12-14T19:38:31.874Z",
                        "__v": 0
                    }
                ]
            },
            {
                "id": "5df539e454fad33b476f6a90",
                "name": "Mix Bag",
                "about": "Quiz about everything.",
                "body": {
                    "name": "Quizzing Club",
                    "about": "Quizzing Related Activities In The Campus",
                    "id": "5df4f4d43840e5f1400b2007",
                    "department": "BRCA",
                    "isSub": true
                },
                "startDate": "2019-12-23T19:36:00.000Z",
                "endDate": "2019-12-25T19:37:00.000Z",
                "stared": false,
                "image": "",
                "venue": "SAC CR",
                "updates": [
                    {
                        "_id": "5df5cef6bf58419a1dc57a43",
                        "title": "TITLE",
                        "body": "for all years",
                        "createdAt": "2019-12-15T06:13:10.935Z",
                        "updatedAt": "2019-12-15T06:13:10.935Z",
                        "__v": 0
                    }
                ]
            },
            {
                "id": "5e01a6f2cb3ea7334344b55f",
                "name": "Fresher's quiz",
                "about": "quiz for freshers",
                "body": {
                    "name": "Quizzing Club",
                    "about": "Quizzing Related Activities In The Campus",
                    "id": "5df4f4d43840e5f1400b2007",
                    "department": "BRCA",
                    "isSub": true
                },
                "startDate": "2019-12-25T11:19:00.000Z",
                "endDate": "2019-12-26T11:19:00.000Z",
                "stared": false,
                "image": "",
                "venue": "LH-310",
                "updates": []
            },
            {
                "id": "5e0ad6d3b81e9518ee1987d5",
                "name": "Hackathon",
                "about": "make something",
                "body": {
                    "name": "DevClub",
                    "about": "Software Development Club",
                    "id": "5df4f4753840e5f1400b2006",
                    "department": "CSE",
                    "isSub": false
                },
                "startDate": "2019-12-31T17:00:00.000Z",
                "endDate": "2020-01-02T17:00:00.000Z",
                "stared": false,
                "image": "",
                "venue": "LH-310",
                "updates": [
                    {
                        "_id": "5e0ad768b81e9518ee1987d6",
                        "title": "TITLE",
                        "body": "event is for all years",
                        "createdAt": "2019-12-31T05:06:48.926Z",
                        "updatedAt": "2019-12-31T05:06:48.926Z",
                        "__v": 0
                    }
                ]
            },
            {
                "id": "5eb66d53fe865372528349c8",
                "name": "Test Quiz",
                "about": "AF",
                "body": {
                    "name": "Quizzing Club",
                    "about": "Quizzing Related Activities In The Campus",
                    "id": "5df4f4d43840e5f1400b2007",
                    "department": "BRCA",
                    "isSub": true
                },
                "startDate": "2020-05-10T14:12:00.000Z",
                "endDate": "2020-05-11T14:12:00.000Z",
                "stared": true,
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wikipedia-logo-v2-en.svg/1200px-Wikipedia-logo-v2-en.svg.png",
                "venue": "Remote",
                "updates": []
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



### 4. Get List of Admins


1. Make post request at /api/users/getAdmins with body of {clubid}
2. The response contains only id of the admins


***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: http://localhost:5000/api/users/getAdmins
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 5ec6a039a3c1605a567ae3f6 |  |



***More example Requests/Responses:***


##### I. Example Request: Get List of Admins


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 5ec6a039a3c1605a567ae3f6 |  |



##### I. Example Response: Get List of Admins
```js
{
    "message": "Success",
    "data": {
        "admins": [
            "5ef867f538c52658f4d2d905"
        ]
    }
}
```


***Status Code:*** 200

<br>



### 5. Logged In User Details


## User Details 
- require only jwt token of user logged in


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{url}}/api/user/me
```



### 6. Remove Admin


## Remove Admin
1. A superadmin can only remove the admin 
2. make post request at /api/users/removeAdmin and provide {userEmail, clubid} in the body of the request


***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: http://localhost:5000/api/users/removeAdmin
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjIxMjJkYzFmMDcxNzg1NGUwMWJhZiIsImlhdCI6MTU3NjI1ODU2OSwiZXhwIjoxNTc2ODYzMzY5fQ.ZpKaksZxRF4g8C8-FgDk32cL_EHESRFa2QpaF-S7kYI |  |
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 600dc91a86476f0cfa84f129 |  |
| userEmail | ee1180494@ee.iitd.ac.in |  |



***More example Requests/Responses:***


##### I. Example Request: Remove Admin(when SuperAdmin status)


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjIxMjJkYzFmMDcxNzg1NGUwMWJhZiIsImlhdCI6MTU3NjI1ODU2OSwiZXhwIjoxNTc2ODYzMzY5fQ.ZpKaksZxRF4g8C8-FgDk32cL_EHESRFa2QpaF-S7kYI |  |
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 5ec6a039a3c1605a567ae3f6 |  |
| userEmail | dev2@gmail.com |  |



##### I. Example Response: Remove Admin(when SuperAdmin status)
```js
{
    "message": "Successfully Deleted The Admin",
    "data": {}
}
```


***Status Code:*** 200

<br>



##### II. Example Request: Remove Admin(when not a super admin)


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZjIxMjJkYzFmMDcxNzg1NGUwMWJhZiIsImlhdCI6MTU3NjI1ODU2OSwiZXhwIjoxNTc2ODYzMzY5fQ.ZpKaksZxRF4g8C8-FgDk32cL_EHESRFa2QpaF-S7kYI |  |
| Content-Type | application/x-www-form-urlencoded |  |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| clubId | 5ec6a039a3c1605a567ae3f6 |  |
| userEmail | dev2@gmail.com |  |



##### II. Example Response: Remove Admin(when not a super admin)
```js
{
    "errors": {
        "message": "Not Authorized To Perform this Action. Require SuperAdmin Status",
        "error": {
            "name": "Authorization",
            "message": "Not Authorized To Perform this Action. Require SuperAdmin Status"
        }
    }
}
```


***Status Code:*** 500

<br>



### 7. Toggle Star An Event


# Starred event
- provide the event id to toogle the starred feature


***Endpoint:***

```bash
Method: POST
Type: 
URL: http://localhost:5000/api/events/5ec6a078a3c1605a567ae3f7/star
```



---
[Back to top](#iitd-connect)


