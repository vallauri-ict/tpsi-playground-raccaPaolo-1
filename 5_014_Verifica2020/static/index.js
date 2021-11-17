$(document).ready(function () {
  $("#btnInvia").on("click", function () {
    let dataStart = $("#dataStart").val();
    let dataEnd = $("#dataEnd").val();
    let request = inviaRichiesta("post", "/api/date", {
      dataStart: dataStart,
      dataEnd: dataEnd,
    });
    request.fail(errore);
    request.done(function (data) {
      alert(JSON.stringify(data));
    });
  });
});
