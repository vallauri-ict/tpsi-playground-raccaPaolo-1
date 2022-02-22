"use strict";
import { Server, Socket } from "socket.io";
import colors from "colors";
import * as http from "http";
import fs from "fs";
import bodyParser from "body-parser";
import express from "express";
import * as mongodb from "mongodb";
import fileUpload, { UploadedFile } from "express-fileupload";
import { environment } from "./environment";

//#region mongoDB
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING =
  process.env.MONGODB_URI || environment.DB_CONNECTION_STRING;
const DB_NAME = "5B";
//#endregion

/*  SERVER HTTP */

const PORT: number = parseInt(process.env.PORT) || 1337;

const app = express();
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta: ${PORT}`);
  init();
});

let paginaErrore = "";
function init() {
  fs.readFile("./static/error.html", (err, data) => {
    if (!err) paginaErrore = data.toString();
    else paginaErrore = "<h2>Risorsa non trovata</h2>";
  });
}

/*  ******************************************
    //  elenco delle routes middleware
    ****************************************** */

//  1. Log
app.use("/", (req, res, next) => {
  console.log("---> ", req.method + ": " + req.originalUrl);
  next();
});

//  2. Static route
app.use("/", express.static("./static")); //  next fa in automatico

//  3. Route lettura paramentri post e impostazione del limite per le immagini base64
app.use("/", bodyParser.json({ limit: "10mb" }));
app.use("/", bodyParser.urlencoded({ extended: true, limit: "10mb" }));

//  4. Log dei parametri
app.use("/", (req, res, next) => {
  if (Object.keys(req.query).length > 0) console.log("GET --->", req.query);
  if (Object.keys(req.body).length > 0) console.log("BODY --->", req.body);
  next();
});

//  5. Connessione al DB
app.use("/", (req, res, next) => {
  mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (err) res.status(503).send("DB connection error");
    else {
      req["client"] = client;
      next();
    }
  });
});

//7. Controllo dimensione dei file
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, //  10MB
  })
);

/*  ******************************************
    elenco delle routes di risposta al client
    ****************************************** */

app.get("/api/images", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection("images");
  collection
    .find({})
    .toArray()
    .then((data) => res.send(data))
    .catch((err) => res.status(503).send("QUERY: Syntax error"))
    .finally(() => req["client"].close());
});

/*  SERVER SOCKET */

const io = new Server(httpServer);

app.use(express.static("./static"));

/************************* gestione web socket ********************** */
let users = [];

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  Per ogni utente la funzione di callback crea una variabile locale
  'user' contenente tutte le informazioni relative al singolo utente  */

io.on("connection", function (clientSocket) {
  let user = {} as { username: string; room: string; socket: Socket };

  // 1) ricezione username
  clientSocket.on("login", function (userInfo) {
    userInfo = JSON.parse(userInfo);
    // controllo se user esiste già
    let item = users.find(function (item) {
      return item.username == userInfo.username;
    });
    if (item != null) {
      clientSocket.emit("loginAck", "NOK");
    } else {
      user.username = userInfo.username;
      user.room = userInfo.room;
      user.socket = clientSocket;
      users.push(user);
      clientSocket.emit("loginAck", "OK");
      log(
        "User " +
          colors.yellow(user.username) +
          " (sockID=" +
          user.socket.id +
          ") connected!"
      );

      //inserisco username nella stanza corretta
      this.join(user.room);
    }
  });

  // 2) ricezione di un messaggio
  clientSocket.on("message", function (msg) {
    log(
      "User " +
        colors.yellow(user.username) +
        " (sockID=" +
        user.socket.id +
        ") sent " +
        colors.green(msg)
    );
    // notifico a tutti i socket (mittente compreso) il messaggio ricevuto

    let img = "";
    mongoClient.connect(
      CONNECTION_STRING,
      (err, client: mongodb.MongoClient) => {
        if (!err) {
          let db = client.db() as mongodb.Db;
          let collection = db.collection("images");
          collection
            .findOne({ username: user.username })
            .then((data) => (img = data.img))
            .catch((err) => console.error("USERNAME: not found"))
            .finally(() => client.close());
        }
      }
    );

    let response = {
      from: user.username,
      message: msg,
      date: new Date(),
      img,
    };

    // gestione spedizione a tutti, mittente compreso
    // io.sockets.emit("message_notify", JSON.stringify(response));
    io.to(user.room).emit("message_notify", JSON.stringify(response));
  });

  // 3) disconnessione dell'utente
  clientSocket.on("disconnect", function () {
    // ritorna -1 se non lo trova
    let index = users.findIndex(function (item) {
      return item.username == user.username;
    });
    users.splice(index, 1);
    log(" User " + user.username + " disconnected!");
  });
});

// stampa i log con data e ora
function log(msg) {
  console.log(
    colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " + msg
  );
}
