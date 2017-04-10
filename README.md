# chat-api
Api component for chat application

## pre-requisites

Run mongod instance at localhost, default port (27017), otherwise few features won't work.

## Setup

1. Check the npm packages:

    ```
    npm install
    ```

2. Create build:

    ```
    grunt
    ```

2. Start the application

    ```
    node dist/api.js
    ```

## Managing the project with Grunt

* Runs eslint, babel:dist

    ```
    grunt
    ```

* Compiles the .es6 files to .js

    ```
    grunt babel:dist
    ```

Server will start at port : 8020

healthcheck url: http://localhost:8020/chat-api/v1/healthcheck
