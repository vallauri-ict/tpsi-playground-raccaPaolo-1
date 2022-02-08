//#region import
import * as http from "http";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import express from "express";
import * as mongodb from "mongodb";
//#endregion

//#region mongoDB
const mongoClient = mongodb.MongoClient;
// const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const CONNECTION_STRING =
  "mongodb+srv://admin:admin@cluster0.niwz6.mongodb.net/5B?retryWrites=true&w=majority";
const DB_NAME = "5B";
//#endregion

const PORT: number = 1337;
const app = express();

const server = http.createServer(app);

server.listen(PORT, () => {
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

//  3. Route lettura paramentri post
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));

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

/*  ******************************************
    elenco delle routes di risposta al client
    ****************************************** */
app.get("/api/risorsa1", (req, res, next) => {
  let nome = req.query.name;
  if (nome) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection("unicorns");
    collection
      .find({ name: nome })
      .toArray()
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("Errore nella sintassi della query"))
      .finally(() => req["client"].close());
  } else {
    res.status(400).send("Parametro mancante: unicornName");
    req["client"].close();
  }
});

app.patch("/api/risorsa1", (req, res, next) => {
  let nome = req.body.nome;
  let incVampires = req.body.vampires;
  if (nome && incVampires) {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection("unicorns");
    collection
      .updateOne({ name: nome }, { $inc: { vampires: incVampires } })
      .then((data) => res.send(data))
      .catch((err) => res.status(503).send("Errore nella sintassi della query"))
      .finally(() => req["client"].close());
  } else {
    res.status(400).send("Numero parametri insufficiente");
    req["client"].close();
  }
});

app.get("/api/risorsa3/:gender/:hair", (req, res, next) => {
  let genere = req.params.gender;
  let pelo = req.params.hair;
  //  if non serve dato che entra nella route solo in caso trovi i parametri
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection("unicorns");
  collection
    .find({ $and: [{ gender: genere }, { hair: pelo }] })
    .toArray()
    .then((data) => res.send(data))
    .catch((err) => res.status(503).send("Errore nella sintassi della query"))
    .finally(() => req["client"].close());
});

/*  ******************************************
    default route e route di gestione degli errori
    ****************************************** */
app.use("/", (req, res, next) => {
  res.status(400);
  res.send("Risorsa non trovata");
});

app.use("/", (req, res, next) => {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) res.send("Servizio non trovato");
  else res.send(paginaErrore);
});
