$(document).ready(function () {
  $("#btnInvia").on("click", function () {
    let request = inviaRichiesta("get", "/api/risorsa1", { name: "Aurora" });
    request.fail(errore);
    request.done(function (data) {
      if (data.lenght > 0) alert(JSON.stringify(data));
      else alert("Nessuna corrispondenza trovata");
    });
  });

  $("#btnInvia2").on("click", function () {
    let request = inviaRichiesta("patch", "/api/risorsa1", {
      nome: "Unico",
      vampires: 3,
    });
    request.fail(errore);
    request.done(function (data) {
      if (data.modifiedCount > 0) alert("Aggiornamento eseguito correttamente");
      else alert("Nessuna corrispondeza trovata");
    });
  });

  $("#btnParamRes").on("click", function () {
    let request = inviaRichiesta("get", `/api/risorsa3/m/brown`);
    request.fail(errore);
    request.done(function (data) {
      console.log(data);
    });
  });

  $("#btnInviaError").on("click", function () {
    let request = inviaRichiesta("get", "/api/servizio3", { nome: "pippo" });
    request.fail(errore);
    request.done(function (data) {
      alert(JSON.stringify(data));
    });
  });
});
