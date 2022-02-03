//#region import
import * as http from "http";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import express from "express";
import * as mongodb from "mongodb";
import cors, { CorsOptions } from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";
import { environment } from "./environment";
//#endregion

//#region mongoDB
const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:admin@cluster0.niwz6.mongodb.net/5B?retryWrites=true&w=majority";
// const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
// const CONNECTION_STRING =
//   "mongodb+srv://admin:admin@cluster0.niwz6.mongodb.net/5B?retryWrites=true&w=majority";
const DB_NAME = "5B";
//#endregion

const PORT: number = parseInt(process.env.PORT) || 1337;

cloudinary.v2.config({
  cloud_name: environment.CLOUD_NAME,
  api_key: environment.API_KEY,
  api_secret: environment.API_SECRET,
});

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

//  6. Middleware cors
const whitelist = [
  "https://raccapaolo-crudserver.herokuapp.com",
  "http://raccapaolo-crudserver.herokuapp.com",
  "http://localhost:1337",
  "http://localhost:4200",
];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true,
};
app.use("/", cors(corsOptions));

//  7. Controllo dimensione dei file
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, //  10MB
  })
);

//  8. base64 fileUpload
app.use("/", express.json({ limit: "50mb" }));

/*  ******************************************
    elenco delle routes di risposta al client
    ****************************************** */

let currentCollection: string = "images";

//  listener specifici
app.get("/api/images", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection(currentCollection);
  collection
    .find({})
    .toArray()
    .then((data) => res.send(data))
    .catch((err) => res.status(503).send("QUERY: Syntax error"))
    .finally(() => req["client"].close());
});

app.post("/api/uploadBinary", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !req.body["username"]
  )
    //  parametri "normali" vengono inseriti nel body
    res.status(400).send("Missing data");
  else {
    const file = req.files["img"] as UploadedFile;
    file.mv("./static/img/" + file.name, (err) => {
      if (err) res.status(500).json(err.message);
      else {
        let collection = db.collection(currentCollection);
        collection
          .insertOne({
            username: req.body["username"],
            img: file.name,
          })
          .then((data) => res.send(data))
          .catch((err) => res.status(503).send("QUERY: Syntax error"))
          .finally(() => req["client"].close());
      }
    });
  }
});

app.post("/api/uploadBase64", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection(currentCollection);
  collection
    .insertOne(req.body)
    .then((data) => res.send(data))
    .catch((err) => res.status(503).send("QUERY: Syntax error"))
    .finally(() => req["client"].close());
});

app.post("/api/cloudinaryBase64", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;

  cloudinary.v2.uploader
    .upload(req.body["img"], { folder: "ImageUpload" })
    .then((url: UploadApiResponse) => {
      let collection = db.collection(currentCollection);
      collection
        .insertOne({ username: req.body["username"], img: url.secure_url })
        .then((data) => res.send(data))
        .catch((err) => res.status(503).send("QUERY: Syntax error"))
        .finally(() => req["client"].close());
    })
    .catch((err) =>
      res.status(500).send("CLOUDINARY: error during image uploading")
    );
});

app.post("/api/cloudinaryBinary", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !req.body["username"]
  )
    //  parametri "normali" vengono inseriti nel body
    res.status(400).send("Missing data");
  else {
    const file = req.files["img"] as UploadedFile;
    file.mv("./static/img/" + file.name, (err) => {
      if (err) res.status(500).json(err.message);
      else {
        cloudinary.v2.uploader
          .upload(`./static/img/${file.name}`, {
            folder: "ImageUpload",
            use_filename: true,
          })
          .then((url: UploadApiResponse) => {
            let collection = db.collection(currentCollection);
            collection
              .insertOne({ username: req.body["username"], img: file.name })
              .then((data) => res.send(data))
              .catch((err) => res.status(503).send("QUERY: Syntax error"))
              .finally(() => req["client"].close());
          })
          .catch((err) =>
            res.status(500).send("CLOUDINARY: error during image uploading")
          );
      }
    });
  }
});

/*  ******************************************
    default route e route di gestione degli errori
    ****************************************** */
app.use("/", (err, req, res, next) => {
  console.log("**** ERRORE SERVER ***** " + err); //  da correggere
});
