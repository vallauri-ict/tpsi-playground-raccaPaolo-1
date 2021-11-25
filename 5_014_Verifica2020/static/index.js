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
      let body = $("#dataEnd").parent();
      let _table = $("<table>");
      body.append(_table);
      for (const item of data) {
        let _tr = $("<tr>");
        _table.append(_tr);
        for (const key in item) {
          const element = item[key];
          _tr.append($("<td>").html(element));
        }
      }
      // $("td").css({ border: "1px solid black;" });
    });
  });
});
