import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

//query 1
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("orders")
      .aggregate([
        { $match: { status: "A" } },
        { $group: { _id: "$cust_id", tot: { $sum: "$amount" } } }, //_id indica il campo su cui devo andare ad effettuare i gruppi e nomi di campo sempre predecuti da dollaro, se usati come valore
        { $sort: { tot: -1 } },
      ]) //dopo il group rimane una tabella con 2 colonne, cust_id e amount, gli altri vengono persi
      .toArray()
      .then((data) => console.log("Query 1", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 2
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("orders")
      .aggregate([
        {
          $group: {
            _id: "$cust_id",
            tot: { $avg: "$amount" },
            avgTotal: { $avg: { $multiply: ["$qta", "$amount"] } },
          },
        }, //_id indica il campo su cui devo andare ad effettuare i gruppi e nomi di campo sempre predecuti da dollaro, se usati come valore
        { $sort: { tot: -1 } },
      ]) //dopo il group rimane una tabella con 2 colonne, cust_id e amount, gli altri vengono persi
      .toArray()
      .then((data) => console.log("Query 2", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 3
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("unicorns")
      .aggregate([
        {
          $match: {
            gender: { $exists: true },
          },
        },
        {
          $group: {
            _id: "$gender",
            tot: { $sum: 1 },
          },
        }, //_id indica il campo su cui devo andare ad effettuare i gruppi e nomi di campo sempre predecuti da dollaro, se usati come valore
        { $sort: { tot: -1 } },
      ]) //dopo il group rimane una tabella con 2 colonne, cust_id e amount, gli altri vengono persi
      .toArray()
      .then((data) => console.log("Query 3", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 4
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("unicorns")
      .aggregate([
        {
          $group: {
            _id: { gender: "$gender" },
            meiaVampiri: { $avg: "$vampires" },
          },
        }, //_id indica il campo su cui devo andare ad effettuare i gruppi e nomi di campo sempre predecuti da dollaro, se usati come valore
      ]) //dopo il group rimane una tabella con 2 colonne, cust_id e amount, gli altri vengono persi
      .toArray()
      .then((data) => console.log("Query 4", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 5
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("unicorns")
      .aggregate([
        {
          $group: {
            _id: { gender: "$gender", hair: "$hair" },
            nEsemplari: { $sum: 1 },
          },
        },
        { $sort: { nEsemplari: -1, _id: -1 } },
      ])
      .toArray()
      .then((data) => console.log("Query 5", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});
