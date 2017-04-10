"use strict";

export class ChatService {
  constructor(socket, dbService) {
    this.socket = socket;
    this.dbService = dbService;

    this.socket.on("new message", this.newMessage.bind(this));
    this.socket.on("add user", this.addUser.bind(this));
    this.socket.on("user disconnect", this.userDisconnect.bind(this));
  }

  addUser(user) {
    console.log("user connected", user);
    this.broadcast({"text": `${user.name} joined`, "type": "info"});
  }

  broadcast(message) {
    this.socket.broadcast.emit("send", message);
    if (message.type === "msg") {
      this.saveMessage(message);
    }
  }

  listMessages() {
    let collection = "messages",
      query = {
        "body": {
        },
        "fields": {
          "_id": 0,
          "type": 0
        }
      };

    return this.dbService.read({collection, query});
  }

  newMessage(data) {
    console.log(data);
    this.broadcast(data);
  }

  saveMessage(message) {
    console.log("saving message in db", message);
    this.dbService.insert({"collection": "messages", "document": message})
      .catch(err => {
        console.log("error occured in saving message in db", err);
      });
  }

  userDisconnect(user) {
    console.log("user disconnected", user);
    this.broadcast({"text": `${user.name} left`, "type": "info"});
  }
}
