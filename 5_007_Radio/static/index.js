"use strict";

$(document).ready(function () {
  const lstRegioni = $("#lstRegioni");
  const tbody = $("#tbody");

  let req = inviaRichiesta("GET", "api/elenco");
  req.fail(errore);
  req.done((data) => {
    console.log(data);
    lstRegioni.html("");
    lstRegioni.append($("<option>").html("tutti"));
    lstRegioni.on("change", richiestaRadio);
    data.map((region) => {
      lstRegioni.append(
        $("<option>").html(`${region.name} [${region.stationcount} emittenti]`)
      );
    });
  });

  let richiestaRadio = () => {
    //   non posso splittare per lo spazio per il Alto Adige
    let region = lstRegioni.val().split("[")[0];
    region = region.substring(0, region.length - 1);
    console.log(region);
    let req = inviaRichiesta("POST", "api/radio", { region: region });
    req.fail(errore);
    req.done((data) => {
      console.log(data);
      tbody.empty();
      data.map((radio) => {
        let tr = $("<tr>");
        tr.appendTo(tbody);
        let td = $("<td>");
        td.appendTo(tr);
        let img = $("<img>").prop("src", radio.favicon).css({ width: "40px" });
        img.appendTo(td);
        td = $("<td>").html(radio.name);
        td.appendTo(tr);
        td = $("<td>").html(radio.codec);
        td.appendTo(tr);
        td = $("<td>").html(radio.bitrate);
        td.appendTo(tr);
        td = $("<td>").html(radio.votes);
        td.appendTo(tr);
        td = $("<td>");
        td.appendTo(tr);
        img = $("<img>")
          .prop("src", "./like.jpg")
          .on("click", addLike)
          .css({ width: "40px" })
          .prop("uid", radio.id);
        img.appendTo(td);
      });
    });
  };
  function addLike() {
    console.log($(this).prop("uid"));
    let req = inviaRichiesta("POST", "api/updateLike", {
      radioId: $(this).prop("uid"),
    });
    req.fail(errore);
    req.done((votes) => {
      $(this).parent().prev().html(votes);
    });
  }
});
