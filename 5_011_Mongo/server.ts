import * as http from "http";
import * as fs from "fs";
import * as mongodb from "mongodb";

import { Dispatcher } from "./dispatcher";
import HEADERS from "./headers.json";

const mongoClient = mongodb.MongoClient;
const PORT: number = 1337;

let dispatcher: Dispatcher = new Dispatcher();

let server = http.createServer((req, res) => {
  dispatcher.dispatch(req, res);
});
server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

//  registrazione dei servizi
mongoClient.connect("mongodb://127.0.0.1:27017", (err, client) => {
  console.log(err);
  if (!err) {
    let db = client.db("5b_studenti");
    let collection = db.collection("Studenti");
    collection.find().toArray((err, data) => {
      if (!err) {
        console.log(data);
      } else {
        console.log("Errore esecuzione query: " + err.message);
      }
    });
    client.close();
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  inserimento nuovo record
mongoClient.connect("mongodb://127.0.0.1:27017", (err, client) => {
  console.log(err);
  if (!err) {
    let db = client.db("5b_studenti");
    let collection = db.collection("Studenti");
    let student = {
      "nome": "Giada",
      "cognome": "Valinotto",
      "classe": "5BInfo",
      "hobbies": ["Leggere", "Musica"],
      "indirizzo": [{ "citta": "Savigliano", "cap": 12040 }],
    };
    collection.insertOne(student,(err,data)=>{
      if(!err){
        console.log(data);
      }else{
        console.log(err);
      }
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});
