import * as http from "http";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";

const PORT: number = 1337;

let dispatcher: Dispatcher = new Dispatcher();

let server = http.createServer((req, res) => {
  dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

//  registrazione dei servizi
dispatcher.addListener("POST", "/api/servizio1", (req, res) => {
  res.writeHead(200, HEADERS.json);
  //  se c'è un solo write posso metterla dentro end
  res.end(JSON.stringify({ res: req.BODY.nome, id: req["GET"].id }));
});

dispatcher.addListener("GET", "/api/servizio2", (req, res) => {
  res.writeHead(200, HEADERS.json);
  //  se c'è un solo write posso metterla dentro end
  res.end(JSON.stringify({ res: req.GET.nome }));
});
