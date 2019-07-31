# IITD-CONNECT

## Running The Server Locally On Your System

- Clone The Repo

- Head Over To [mlab](https://www.mlab.com) and Get The Url for a MongoDB Database
- Go to [Facebook For Developers](https://developers.facebook.com) and [Google Developers Console](https://console.developers.google.com) and set up projects

- Get The Following Credentials From The Above Links and Add Them To A `.env` file in the `src` folder
  - Google App Client ID `GOOGLE_CLIENTID`
  - Google App Client Secret `GOOGLE_SECRET`
  - FaceBook App Client ID `FACEBOOK_CLIENTID`
  - FaceBook App Client Secret `FACEBOOK_SECRET`
  - JWT Secret `JWT_SECRET`
- Run The Server In Development Mode using `yarn run watch`

- View at `localhost:5000`
