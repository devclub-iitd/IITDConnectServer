# Common Audio Video Server

[![GitHub Actions][github-image-ci]][github-url]
[![TypeScript Style Guide][gts-image]][gts-url]
[![Node v12.13.0][node-image]][node-url]

## Getting Started

### Prerequisites

To run this project in the development mode, you'll need to have a basic environment with NodeJS 13+ installed. To use the database, you'll need to have MongoDB installed and running on your machine at the default port (27017).

### Installing

**Cloning the Repository**

```
$ git clone https://github.com/devclub-iitd/IITDConnectServer.git

$ cd IITDConnectServer
```

**Installing dependencies**

```
$ npm install
```

## Built With

- [NodeJS](https://nodejs.org/en/) - Build the server
- [body-Parser](https://github.com/expressjs/body-parser#readme) - Node.js body parsing middleware
- [express](https://expressjs.com/) - Router of the Application
- [MongoDB](https://www.mongodb.com/) - Database
- [mongoose](https://mongoosejs.com/) - Object Modeling + DB Connector
- [nodemon](https://nodemon.io/) - Process Manager used in the development
- [dotenv](https://github.com/motdotla/dotenv) - Environment loader
- [gts](https://github.com/google/gts) - TS Linter and code style
- [prettier](https://github.com/prettier/prettier) - Code formatter

## License

[MIT](LICENSE)

[github-image-ci]: https://github.com/devclub-iitd/CommonAudioVideoServer/workflows/Node.js%20CI/badge.svg
[github-url]: https://github.com/devclub-iitd/CommonAudioVideoServer/actions
[gts-image]: https://img.shields.io/badge/code%20style-google-blueviolet.svg
[gts-url]: https://github.com/google/gts
[node-image]: https://img.shields.io/badge/Node-v12.13.0-blue.svg
[node-url]: https://nodejs.org/en/blog/release/v12.13.0
