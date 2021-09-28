import * as http from "http";
import * as url from "url";
import * as fs from "fs";
import * as mime from "mime";
import { listeners } from "process";

const HEADERS = require("headers.json");
let paginaErrore: string;

class Dispatcher {
  prompt: string = ">>>";
  //listener = json con chiave = risorsa e valore = la callback da effettuare, suddivisi per metodo di chiamata
  listeners: any = { GET: {}, POST: {}, DELETE: {}, PATCH: {}, PUT: {} };

  constructor() {}

  addListener = function (method: string, resource: string, callback: any) {
    method = method.toUpperCase();
    //  if(this.listeners[method]){}
    if (method in this.listeners) {
      this.listeners[method][resource] = callback;
    } else {
      throw new Error("Invalid method");
    }
  };
}
