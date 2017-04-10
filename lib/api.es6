"use strict";

import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import moment from "moment";
import {ChatService} from "./services/ChatService";
import {MongoDbService} from "./services/MongoDbService";
import mwAllowCrossDomain from "./middleware/mwAllowCrossDomain";

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  app = express(),
  server = require("http").Server(app),
  urlPrefix = config.urlPrefix,
  io = require("socket.io").listen(server),
  dbService = new MongoDbService(config),
  chatService;

function init() {
  io.on("connection", function (socket) {
    console.log("io connection created");
    chatService = new ChatService(socket, dbService);
  });
}

init();

// Sets the relevant config app-wise
app.set("port", config.http.port);

app.use(bodyParser.json());
app.use(mwAllowCrossDomain);

app.use(`${urlPrefix}/healthcheck`, (req, res) => {
  res.send("OK");
});

app.get(`${urlPrefix}/messages`, (req, res) => {
  console.log("inside get message service");
  chatService.listMessages()
    .then(msgs => {
      res.status(200).send(msgs);
    })
    .catch(err => {
      console.log("Error occurred in fetcing messages ", err);
      res.status(500).send({"error": "Error occurred in fetching history."});
    });
});

app.use(methodOverride);

// Starts the app
server.listen(app.get("port"), function () {
  console.log(`Server has started at datetime ${moment().format()} and is listening on port: ${app.get("port")}`);

  process.on("uncaughtException", err => {
    console.log("uncaughtException", err);
  });
});
