"use strict";

var config = {
  "http": {
    "protocol": "http",
    "domain": "127.0.0.1",
    "port": 8020
  },
  "mongoDb": {
    "connectionString": "mongodb://127.0.0.1:27017/chat_server",
  },
  "urlPrefix": "/chat-api/v1",
};

module.exports = config;
