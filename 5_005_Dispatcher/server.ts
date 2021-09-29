import * as http from "http";
const HEADERS = require("./headers.json");
const dispatcher = require("./dispatcher.ts");

const PORT: number = 1337;

let server = http.createServer((req, res) => {
    dispatcher.dispatch(req,res);
});

server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);

//  registrazione dei servizi
dispatcher.addListener("POST", "/api/servizio1", (req, res) => {
    res.writeHead(200,HEADERS.json);
    //  se c'è un solo write posso metterla dentro end
    res.end(JSON.stringify({res:'OK'}));
});
