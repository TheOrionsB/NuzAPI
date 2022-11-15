# nuzStnrAPI

NuzStnrAPI is the api for the Nuz shortener project. In continuity with my frontend, I'm using a technology that i've never used before, it's my first project with Typescript.

The goal of the Nuz sortener is to provide a Free, anonymous, and feature rich URL shortener. It doesn't have any ambition of being adopted by the masses but I feel like it's quite a nice project to tackle with with new technologies


## Deployment

### Yarn | NPM

- Clone
- Install dependencies: ``$ yarn install`` or ``$ npm install``
- Create an .env file or set env variables that contains the following variables:
  - ```MONGO_URI``` The host and port and database to access the mongodb server, EG:``mongodb://localhost:27017/exampledb``
  - ```MONGO_USER``` A user that has read and write permissions to the database entered in ``MONGO_URI``
  - ```MONGO_PASS``` Password of the user used in ``MONGO_USER``
  - ```APP_ENC``` A secret key, whatever the format. This will be used to sign authentication token

### Docker

> No docker deployment method available yet. It will soon be created.