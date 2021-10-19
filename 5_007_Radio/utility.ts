import * as fs from "fs";
import RADIOS from "./radios.json";
// import STATES from "./states.json";

let STATES;
fs.readFile("./radios.json", (err, data) => {
  //  data è un file binario che deve essere convertito in stringa
  STATES = JSON.parse(data.toString());
  STATES.map((region) => {
    let aus = RADIOS.filter((radio) => radio.state == region.value);
    region.stationcount = aus.length.toString();
  });
  fs.writeFile("./states.json", JSON.stringify(STATES), () =>
    console.log("finish")
  );
});
//  nodemon --ignore 'states.json' utility.ts