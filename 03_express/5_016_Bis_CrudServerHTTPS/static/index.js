"use strict";

$(document).ready(function () {
  let divIntestazione = $("#divIntestazione");
  let divCollections = $("#divCollections");
  let table = $("#mainTable");
  let divDettagli = $("#divDettagli");
  let currentCollection = "";
  let filters = $(".card").first();
  filters.hide();

  let request = inviaRichiesta("get", "api/getCollections");
  request.fail(errore);
  request.done((collections) => {
    console.log(collections);
    let label = divCollections.children("label");
    for (const item of collections) {
      let clone = label.clone();
      divCollections.append(clone);
      clone.children("input").val(item.name);
      clone.children("span").text(item.name);
      divCollections.append("<br>");
    }
    label.remove();
  });

  divCollections.on("click", "input[type=radio]", function () {
    currentCollection = $(this).val();
    if (currentCollection === "unicorns") filters.show();
    else filters.hide();
    table.children("tbody").empty();
    let request = inviaRichiesta("GET", `/api/${currentCollection}`);
    request.fail(errore);
    request.done(disegnaTabella);
    console.log();
  });

  function disegnaTabella(data) {
    {
      divIntestazione.find("strong").eq(0).text(currentCollection);
      divIntestazione.find("strong").eq(1).text(data.length);
      for (const item of data) {
        let tr = $("<tr>");
        tr.appendTo(table.children("tbody"));
        let td = $("<td>");
        tr.append(td.text(item._id));
        td.prop({ id: item._id, method: "get" });
        td.on("click", visualizzaDettagli);
        td = $("<td>");
        tr.append(td.text(item.name));
        td.prop({ id: item._id, method: "get" });
        td.on("click", visualizzaDettagli);
        td = $("<td>");
        td.append(
          $("<div>")
            .prop({ id: item._id, method: "patch" })
            .on("click", visualizzaDettagli)
        );
        td.append(
          $("<div>")
            .prop({ id: item._id, method: "put" })
            .on("click", visualizzaDettagli)
        );
        td.append($("<div>").prop("id", item._id).on("click", elimina));
        tr.append(td);
      }
    }
  }

  function elimina() {
    let request = inviaRichiesta(
      "DELETE",
      `/api/${currentCollection}/${$(this).prop("id")}`
    );
    request.fail(errore);
    request.done((data) => {
      aggiornaTabella();
      alert("Documento eliminato correttamente");
    });
  }

  function visualizzaDettagli() {
    const method = $(this).prop("method").toUpperCase();
    const id = $(this).prop("id");
    let req = inviaRichiesta("GET", `/api/${currentCollection}/${id}`);
    req.fail(errore);
    req.done((data) => {
      if (method === "GET") {
        let content = "";
        for (const key in data) {
          content += `<strong>${key}</strong> ${data[key]} <br>`;
        }
        divDettagli.html(content);
      } else {
        divDettagli.empty();
        let txtarea = $("<textarea>");
        delete data._id;
        txtarea.val(JSON.stringify(data, null, 2));
        txtarea.appendTo(divDettagli);
        txtarea.css({ height: txtarea.get(0).scrollHeight + "px" });
        creaPulsanteInvia(method, id);
      }
    });
  }

  $("#btnAdd").on("click", () => {
    divDettagli.empty();
    let txtarea = $("<textarea>");
    txtarea.val("{}");
    txtarea.appendTo(divDettagli);
    creaPulsanteInvia("POST");
  });

  function aggiornaTabella() {
    let event = jQuery.Event("click");
    event.target = divCollections.find("input[type=radio]:checked")[0];
    divDettagli.empty();
    divCollections.trigger(event);
  }

  function creaPulsanteInvia(method, id = "") {
    let button = $("<button>");
    button.text("Invia");
    button.appendTo(divDettagli);
    button.on("click", () => {
      let param;
      try {
        param = JSON.parse($(divDettagli).children("textarea").val());
      } catch (error) {
        alert("JSON NON VALIDO");
      }
      const request = inviaRichiesta(
        method,
        `/api/${currentCollection}/${id}`,
        param
      );
      request.fail(errore);
      request.done((data) => {
        divDettagli.empty();
        aggiornaTabella();
        alert("Operazione eseguita correttamente");
      });
    });
  }

  $("#btnFind").on("click", function () {
    let filterJson = {};
    let hair = $("#lstHair").children("option:selected").val();
    if (hair) filterJson["hair"] = hair.toLowerCase();

    let male = filter.find("input[type=checkbox]").first().is(":checked");
    let female = filter.find("input[type=checkbox]").last().is(":checked");
    if (male && !female) filterJson["gender"] = "m";
    else if (female && !male) filterJson["gender"] = "f";

    let request = inviaRichiesta("get", "/api/" + currentCollection, filterJson);
    request.fail(errore);
    request.done(disegnaTabella);
  });
});
