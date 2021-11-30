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

//  query 6
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("unicorns")
      .aggregate([
        {
          $group: {
            _id: { gender: {} },
            media: { $avg: "$vampires" },
          },
        },
        { $project: { _id: 0, media_arr: { $round: "$media" } } },
      ])
      .toArray()
      .then((data) => console.log("Query 6", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 7
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("quizzes")
      .aggregate([
        {
          $project: {
            quizAvg: { $avg: "$quizzes" },
            labAvg: { $avg: "$labs" },
            examAvg: { $avg: ["$midterm", "$final"] },
          },
        },
        {
          $project: {
            quizAvg: { $round: ["$quizAvg", 1] },
            labAvg: { $round: ["$labAvg", 1] },
            examAvg: { $round: ["$examAvg", 1] },
          },
        },
        {
          $group: {
            _id: {},
            mediaQuizAvg: { $avg: "$quizAvg" },
            mediaLabAvg: { $avg: "$labAvg" },
            mediaExamAvg: { $avg: "$examAvg" },
          },
        },
        {
          $project: {
            mediaQuizAvg: { $round: ["$mediaQuizAvg", 2] },
            mediaLabAvg: { $round: ["$mediaLabAvg", 2] },
            mediaExamAvg: { $round: ["$mediaExamAvg", 2] },
          },
        },
      ])
      .toArray()
      .then((data) => console.log("Query 7", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 8
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let regex = new RegExp("F", "i");
    db.collection("students")
      .aggregate([
        {
          $match: {
            genere: { $regex: regex },
          },
        },
        {
          $project: {
            nome: 1,
            mediaVoti: { $avg: "$voti" },
            //  id portato avanti per default
          },
        },
        {
          $sort: {
            mediaVoti: -1,
          },
        },
        {
          $skip: 1,
        },
        {
          $limit: 1,
        },
      ])
      .toArray()
      .then((data) => console.log("Query 8", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 9
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("orders")
      .aggregate([
        {
          $project: {
            status: 1,
            nDettagli: 1,
          },
        },
        {
          $unwind: "$nDettagli",
        },
        {
          $group: {
            _id: "$status",
            elementi: { $sum: "$nDettagli" },
          },
        },
      ])
      .toArray()
      .then((data) => console.log("Query 9", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 10
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    //  se posso usare il find e non è il caso di usare l'aggregate meglio, più veloce
    db.collection("students")
      .find({
        $expr: {
          $gte: [{ $year: "$nato" }, 2000],
        },
      })
      .toArray()
      .then((data) => console.log("Query 9", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 11
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("unicorns")
      .aggregate([
        {
          $match: {
            loves: { $in: ["apple"] },
            gender: { $exists: true },
          },
        },
        {
          $group: {
            _id: "$gender",
            vampiri: { $sum: "$vampires" },
          },
        },
      ])
      .toArray()
      .then((data) => console.log("Query 11", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 12
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("unicorns")
      .aggregate([
        {
          $unwind: "$loves",
        },
        {
          $group: {
            _id: "$loves",
            cont: { $count: {} },
          },
        },
        {
          $sort: {
            cont: -1,
          },
        },
      ])
      .toArray()
      .then((data) => console.log("Query 11", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//  query 13
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    db.collection("students")
      .aggregate([
        {
          $project: {
            classe: 1,
            mediaVoti: { $avg: "$voti" },
          },
        },
        {
          $group: {
            _id: "$classe",
            mediaClasse: { $avg: "$mediaVoti" },
          },
        },
        {
          $match: {
            mediaClasse: { $gte: 6 },
          },
        },
        {
          $sort: {
            mediaClasse: -1,
          },
        },
      ])
      .toArray()
      .then((data) => console.log("Query 11", data))
      .catch((err) => console.log("Errore esecuzione query: " + err.message))
      .finally(() => client.close());
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});
