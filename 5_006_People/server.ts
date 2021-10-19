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
  let nazioni = [];
  for (const item of PEOPLE.results) {
    if (!nazioni.includes(item.location.country)) {
      nazioni.push(item.location.country);
    }
    nazioni.sort();
  }
  res.writeHead(200, HEADERS.json);
  res.end(JSON.stringify({ nations: nazioni }));
});

dispatcher.addListener("GET", "/api/getPeople", (req, res) => {
  let nation: string = req.GET.nation;
  let people: object[] = [];
  for (const item of PEOPLE.results) {
    if (item["location"].country === nation) {
      people.push({
        name: item.name.title + " " + item.name.first + " " + item.name.last,
        city: item["location"].city,
        state: item["location"].state,
        cell: item.cell,
      });
    }
  }
  res.writeHead(200, HEADERS.json);
  res.end(JSON.stringify(people));
});

dispatcher.addListener("GET", "/api/getDettagli", (req, res) => {
  let citizen: string = req.GET.person;
  let details: object;
  for (const item of PEOPLE.results) {
    if (
      item.name.title + " " + item.name.first + " " + item.name.last ===
      citizen
    ) {
      details = item;
      break;
    }
  }
  if (details) {
    res.writeHead(200, HEADERS.json);
    res.end(JSON.stringify(details));
  } else {
    res.writeHead(404, HEADERS.json);
    res.end(JSON.stringify({ error: "NO USER FOUND" }));
  }
});

dispatcher.addListener("DELETE", "/api/deletePerson", (req, res) => {
  let citizen: string = req.BODY.person;
  let details: object;
  let position = 0;
  for (const item of PEOPLE.results) {
    if (
      item.name.title + " " + item.name.first + " " + item.name.last ===
      citizen
    ) {
      details = item;
      break;
    }
    position++;
  }
  if (details) {
    PEOPLE.results.splice(position, 1);
    res.writeHead(200, HEADERS.json);
    res.end(JSON.stringify({ message: "USER DELETED" }));
  } else {
    res.writeHead(404, HEADERS.json);
    res.end(JSON.stringify({ message: "NO USER FOUND" }));
  }
});
