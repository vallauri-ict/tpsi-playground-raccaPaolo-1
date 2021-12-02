"use strict";
$(document).ready(function () {
  let _lstNazioni = $("#lstNazioni");
  let _tabStudenti = $("#tabStudenti");
  let _divDettagli = $("#divDettagli");

  _divDettagli.hide();

  let selectedNation;

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
    if ($(this).text()) {
      selectedNation = $(this).text();
    }

    let reqPeople = inviaRichiesta("GET", "/api/getPeople", {
      nation: selectedNation,
    });
    reqPeople.fail(errore);
    reqPeople.done((data) => {
      _divDettagli.hide();
      _tabStudenti.empty();
      data.map((person) => {
        let tr = $("<tr>");
        for (const key in person) {
          tr.append($("<td>", { text: person[key] }));
        }

        tr.append(
          $("<td>").append(
            $("<button>", { text: "Dettagli" })
              .on("click", dettagli)
              .prop("name", person.name)
          )
        );
        tr.append(
          $("<td>").append(
            $("<button>", { text: "Elimina" })
              .addClass("elimina")
              .prop("name", person.name)
          )
        );
        tr.appendTo(_tabStudenti);
      });
    });
  }
  //  tabStudenti.on("click", "button.:contains(elimina)", () => {
  _tabStudenti.on("click", "button.elimina", function () {
    let req = inviaRichiesta("DELETE", "/api/deletePerson", {
      person: $(this).prop("name"),
    });
    req.fail(errore);
    req.done(({ message }) => {
      alert(message);
      visualizzaPersone();
    });
  });
  function dettagli() {
    let reqDettagli = inviaRichiesta("GET", "/api/getDettagli", {
      person: $(this).prop("name"),
    });
    reqDettagli.fail(errore);
    reqDettagli.done((data) => {
      _divDettagli.show(1000);
      _divDettagli.children("img").first().prop("src", data.picture.thumbnail);
      _divDettagli.find("h5").first().text($(this).prop("name"));
      let str = `<b>Gender:</b> ${
        data.gender
      }</br><b>Address:</b> ${JSON.stringify(data.location)}</br><b>Email:</b>${
        data.email
      }</br><b>DOB:</b>${JSON.stringify(data.dob)}`;
      _divDettagli.find("p").first().html(str);
    });
  }
});
