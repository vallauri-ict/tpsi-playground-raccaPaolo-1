"use strict";
$(document).ready(function () {
  let _lstNazioni = $("#lstNazioni");
  let _tabStudenti = $("#tabStudenti");
  let _divDettagli = $("#divDettagli");

  _divDettagli.hide();

  let reqNazioni = inviaRichiesta("GET", "/api/getNations");
  reqNazioni.fail(errore);
  reqNazioni.done(({ nations }) => {
    console.log(nations);
    for (const item of nations) {
      let a = $("<a>", {
        class: "dropdown-item",
        href: "#",
        text: item,
        click: visualizzaPersone,
      });
      _lstNazioni.append(a);
    }
  });

  function visualizzaPersone() {
    let nation = $(this).text();
    let reqPeople = inviaRichiesta("GET", "/api/getPeople", { nation: nation });
    reqPeople.fail(errore);
    reqPeople.done((data) => {
      console.log(data);
      _tabStudenti.empty();
      data.map((person) => {
        let tr = $("<tr>");
        for (const key in person) {
          tr.append($("<td>", { text: person[key] }));
        }

        tr.append(
          $("<td>").append(
            $("<button>", { text: "Dettagli" })
          )
        );
        tr.append(
          $("<td>").append($("<button>", { text: "Elimina" }))
        );
        tr.appendTo(_tabStudenti);
      });
    });
  }
});
