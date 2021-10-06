import * as http from "http";
const HEADERS = require("./headers.json");
const PEOPLE = require("./people.json");

const dispatcher = require("./dispatcher.ts");

const PORT: number = 1337;

let server = http.createServer((req, res) => {
  dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

//  registrazione dei servizi
dispatcher.addListener("GET", "/api/getNations", (req, res) => {
  res.writeHead(200, HEADERS.json);
  let nazioni = [];
  for (const item of PEOPLE.results) {
    if (!nazioni.includes(item.location.country)) {
      nazioni.push(item.location.country);
    }
    nazioni.sort();
  }
  res.end(JSON.stringify({ nations: nazioni }));
});

dispatcher.addListener("GET", "/api/servizio2", (req, res) => {
  res.writeHead(200, HEADERS.json);
  //  se c'è un solo write posso metterla dentro end
  res.end(JSON.stringify({ res: req.GET.nome }));
});
