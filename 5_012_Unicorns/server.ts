import * as mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";

//query 1
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({ weight: { $lte: 800, $gte: 700 } })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 1", data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 2
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({
        $and: [{ gender: "m" }, { loves: "grape" }, { vampires: { $gt: 60 } }],
      })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 2", data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 2 bis
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({
        $and: [
          { gender: "m" },
          { loves: { $in: ["grape", "apple"] } },
          { vampires: { $gt: 60 } },
        ],
      })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 2 bis", data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 3
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({ $or: [{ gender: "f" }, { weight: { $lte: 700 } }] })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 3", data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 4
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({
        $and: [
          { loves: { $in: ["apple", "grape"] } },
          { vampires: { $gte: 60 } },
        ],
      })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 4", data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 5
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({ loves: { $all: ["watermelon", "grape"] } })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 5", "Record:" + data.length, data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 6
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({ $or: [{ hair: "brown" }, { hair: "grey" }] })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 6", "Record:" + data.length, data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 6 bis
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({ hair: { $in: ["grey", "brown"] } })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 6 bis", "Record:" + data.length, data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 7
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({
        $and: [{ vaccinated: { $exists: true } }, { vaccinated: false }],
      })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 7", "Record:" + data.length, data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 9 (forma completa)
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    let regex = new RegExp("^A", "i");
    collection
      .find({ $and: [{ name: { $regex: regex } }, { gender: "f" }] })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 9", "Record:" + data.length, data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 10
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({ _id: new mongodb.ObjectId("61823940e6afc3f50bdf18b0") })
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 10", "Record:" + data.length, data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 11
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection
      .find({ gender: "m" })
      .project({ name: 1, vampires: 1, _id: 0 })
      .sort({ vampires: -1, name: 1 })
      .skip(1)
      .limit(3)
      .toArray((err, data) => {
        if (!err) {
          console.log("Query 11", "Record:" + data.length, data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 12
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection.find({ weight: { $gt: 500 } }).count((err, data) => {
      if (!err) {
        console.log("Query 12", data);
      } else {
        console.log("Errore esecuzione query: " + err.message);
      }
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 13
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection.findOne(
      { name: "Aurora" },
      { projection: { weight: 1, hair: 1 } },
      (err, data) => {
        if (!err) {
          console.log("Query 13", data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 14
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection.distinct("loves", { gender: "f" }, (err, data) => {
      if (!err) {
        console.log("Query 14", "Record:" + data.length, data);
      } else {
        console.log("Errore esecuzione query: " + err.message);
      }
      client.close();
    });
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 15
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection.insertOne(
      { name: "Samucorno", gender: "m", loves: ["apple", "banana"] },
      (err, data) => {
        if (!err) {
          console.log("Query 15 insert", data);
          collection.deleteMany({ name: "Samucorno" }, (err, data) => {
            if (!err) {
              console.log("Query 15 delete", data.deletedCount, data);
            } else {
              console.log("Errore esecuzione query: " + err.message);
            }
            client.close();
          });
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
      }
    );
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 16
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection.updateOne(
      { name: "Pluto" },
      { $inc: { vampires: 1 } }, //  il campo di default viene creato se non esistente
      { upsert: true }, //  opzione inesistente in sql tradizionale, crea automaticamente il record da aggiornare ({name: Pluto}) se non esiste
      (err, data) => {
        if (!err) {
          console.log("Query 16", data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});

//query 17
mongoClient.connect(CONNECTION_STRING, (err, client) => {
  if (!err) {
    let db = client.db(DB_NAME);
    let collection = db.collection("unicorns");
    collection.updateOne(
      { name: "Aurora" },
      { $inc: { weight: 10 }, $addToSet: { loves: "carrot" } },
      (err, data) => {
        if (!err) {
          console.log("Query 17", data);
        } else {
          console.log("Errore esecuzione query: " + err.message);
        }
        client.close();
      }
    );
  } else {
    console.log("Errore connessione al db: " + err.message);
  }
});
