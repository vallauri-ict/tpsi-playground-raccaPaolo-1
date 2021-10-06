$(document).ready(function () {
  $("#btnInvia").on("click", function () {
    let request = inviaRichiesta("post", "/api/servizio1?id=5", {
      nome: "pippo",
    });
    request.fail(errore);
    request.done(function (data) {
      alert(JSON.stringify(data));
    });
  });

  $("#btnInvia2").on("click", function () {
    let request = inviaRichiesta("get", "/api/servizio2", { nome: "pippo" });
    request.fail(errore);
    request.done(function (data) {
      alert(JSON.stringify(data));
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
