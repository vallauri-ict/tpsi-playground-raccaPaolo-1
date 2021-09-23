"use strict";

import * as _http from 'http';
const _url = require("url");
const _fs = require("fs");
const _mime = require("mime");
const HEADERS = require("./headers.json");

const PORT:number = 1337;
let paginaErrore: string;

var server = _http.createServer(function (req, res) {
  let method = req.method;
  let url = _url.parse(req.url, true);
  let resource = url.pathname;
  let parameters = url.query;
  console.log(
    `Richiesta: ${method}: ${resource} - Param: ${JSON.stringify(parameters)}`
  );

  if (resource == "/") resource = "/index.html";

  if (!resource.startsWith("/api/")) {
    // / ad inizio resource è già messo in automatico dal Browser
    resource = "./static" + resource;
    _fs.readFile(resource, function (error:string, data:string) {
      if (!error) {
        let header = { "Content-Type": _mime.getType(resource) };
        res.writeHead(200, header);
        res.write(data);
        res.end();
      } else {
        res.writeHead(404, HEADERS.html);
        res.write(paginaErrore);
        res.end();
      }
    });
  } else {
    if (resource === "/api/servizio1") {
      let response = { ris: "OK" };
      res.writeHead(200, HEADERS.json);
      //  Parsificazione da fare a mano
      res.write(JSON.stringify(response));
      res.end();
    } else {
      let response = { ris: "NOT FOUND" };
      res.writeHead(404, HEADERS.json);
      //  Potrei anche restituire stringa, essendo che inviando errore non passa nella parsificazione
      res.write(JSON.stringify(response));
      res.end();
    }
  }
});

server.listen(PORT),
  function () {
    _fs.readFile("./static/error.html", function (errore:string, data:string) {
      if (!errore) {
        paginaErrore = data.toString();
      } else {
        paginaErrore = "<h1>Pagina non trovata</h1>";
      }
    });
  };
console.log(`Server in esecuzione sulla porta ${PORT}`);
