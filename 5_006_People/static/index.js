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
      let tr = $()
    }
  });
});
