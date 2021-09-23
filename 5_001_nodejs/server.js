let _http = require("http");
let _url = require("url");
require("colors");
let HEADERS = require("./headers.json");

let port = 1337;

let server = _http.createServer((req, res) => {
  // res.writeHead(200,HEADERS.text);
  // res.write("Richiesta eseguita correttamente");
  // res.end();
  // console.log("Richiesta eseguita");

  //  lettura di metodo, risorsa e parametri
  let method = req.method;
  //  url viene ricevuta come stringa, viene parsificata in JSON, true parsifica anche i parametri
  let url = _url.parse(req.url, true);
  let resource = url.pathname;
  let parameters = url.query;

  let domain = req.headers.host;

  res.writeHead(200, HEADERS.html);
  res.write("<h1>Informazioni sulla richiesta ricevuta</h1><br>");
  res.write(`<p><b>Risorsa richiesta:</b> ${JSON.stringify(resource)}</p>`);
  res.write(`<p><b>Metodo richiesta:</b> ${JSON.stringify(method)}</p>`);
  res.write(`<p><b>Parametri richiesta:</b> ${JSON.stringify(parameters)}</p>`);
  res.write(`<p><b>Dominio richiesta:</b> ${JSON.stringify(domain)}</p>`);
  res.write(`<p><p>Grazie per la richiesta!</p>`);

  res.end();
  console.log(`Richiesta ricevuta: ${req.url.yellow}`);
});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);
console.log("server in ascolto sulla porta " + port);
