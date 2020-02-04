$(document).ready(function() {
  // scelto il mese iniziale che è sempre gennaio e lo stampo nel titolo
  var meseCorrente = moment("1-2018", "M-YYYY", true);
  $("#meseCorrente").text(meseCorrente.format("MMMM YYYY"));
  // chiamo le due funzioni per stampare i giorni di gennaio e controllare le feste tramite ajax
  printCurrentMonth(meseCorrente);
  printFestivities(meseCorrente);

  // se clikko su next o prev svuoto tutta la ul, cambio il mese corrente e ristampo tutto, se il mese è gennaio o dicembre tolgo un bottone
  $(document).on("click", function(event) {
    if ($(event.target).hasClass("prev")) {
      meseCorrente = meseCorrente.subtract(1, "months");
      $("#meseCorrente").text(meseCorrente.format("MMMM YYYY"));
      $("#calendar").html("");
      $(".next").removeClass("hidden");
      if (meseCorrente.month() == 0) {
        $(".prev").addClass("hidden");
      }
      printCurrentMonth(meseCorrente);
      printFestivities(meseCorrente)
    } else if ($(event.target).hasClass("next")) {
      meseCorrente = meseCorrente.add(1, "months");
      $("#meseCorrente").text(meseCorrente.format("MMMM YYYY"));
      $("#calendar").html("");
      $(".prev").removeClass("hidden");
      if (meseCorrente.month() == 11) {
        $(".next").addClass("hidden");
      }
      printCurrentMonth(meseCorrente);
      printFestivities(meseCorrente)
    }
  })
});

// funzioni
function printCurrentMonth(month) {
  var giorniNelMese = month.daysInMonth();
  for (var i = 1; i <= giorniNelMese; i++) {
    var source = $("#template").html();
    var template = Handlebars.compile(source);
    var context = {date: moment(i + month.format("-M-YYYY"), 'D-M-YYYY', true).format('D MMMM')};
    var html = template(context);
    $("#calendar").append(html);
  }
}

function printFestivities(month) {
  $.ajax(
  {
    url: "https://flynn.boolean.careers/exercises/api/holidays",
    method: "GET",
    data: {
      year: month.year(),
      month: month.month()
    },
    success: function (data) {
      for (var key in data.response) {
        $("#calendar > li").each(function() {
          if (moment(data.response[key].date, 'YYYY-MM-DD', true).format('D MMMM') == $(this).text())
          {
            $(this).append(" - " + data.response[key].name);
            $(this).addClass("red");
          }
        });
      }
    },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errore);
    }
  });
}
