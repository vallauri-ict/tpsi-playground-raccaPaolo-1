import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

//query 1
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("vallauri")
      .aggregate([
        {
          $project: {
            mediaItaliano: { $avg: "$italiano" },
            mediaMatematica: { $avg: "$matematica" },
            mediaInformatica: { $avg: "$informatica" },
            mediaSistemi: { $avg: "$sistemi" },
            classe: 1,
          },
        },
        {
          $project: {
            mediaStudente: {
              $avg: [
                "$mediaItaliano",
                "$mediaMatematica",
                "$mediaSistemi",
                "$mediaInformatica",
              ],
            },
            classe: 1,
          },
        },
        {
          $group: {
            _id: "$classe",
            mediaClasse: { $avg: "$mediaStudente" },
          },
        },
        {
          $sort: {
            mediaClasse: -1,
          },
        },
        {
          $project: {
            mediaClasse: { $round: ["$mediaClasse", 2] },
          },
        },
      ])
      //  elaborazione verticale --> group, orizzontale --> project
      .toArray()
      .then((data) => console.log("Query 1", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 1
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("vallauri")
      .updateMany({ genere: "f" }, { $push: { informatica: 7 as never } })
      .then((data) => console.log("Query 2", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 1
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("vallauri")
      .deleteMany({ $and: [{ classe: "3B" }, { sistemi: { $in: [3] } }] })
      .then((data) => console.log("Query 3", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 1
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("vallauri")
      .aggregate([
        {
          $group: {
            _id: "$classe",
            sommaOre: { $sum: "$assenze" },
          },
        },
        {
          $sort: {
            sommaOre: -1,
          },
        },
      ])
      .toArray()
      .then((data) => console.log("Query 4", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});
