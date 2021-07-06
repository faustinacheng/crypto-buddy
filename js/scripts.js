// var api = "86BD34C5-A59B-4D68-B6C1-CECC1275E7A3";
var api = "52FE8C2C-9ACD-44BC-BE63-F362B9AF4B17";
var search_button = document.getElementById("button");
var search_data = document.getElementById("search_data");
var searchSYM = document.getElementById("id");
var searchNAME = document.getElementById("name");
var currentPrice = document.getElementById("current-price");
var lastPrice = document.getElementById("last-day-price");
var change = document.getElementById("change");
var cryptoImage = document.getElementById("cryptoImage");
var resultsDisplay = document.getElementById("resultsDisplay");

resultsDisplay.style.visibility = "hidden";

// Code for Top 5

// var l1 = document.getElementById("l1");
// var l2 = document.getElementById("l2");
// var l3 = document.getElementById("l3");
// var l4 = document.getElementById("l4");
// var l5 = document.getElementById("l5");

// async function calc_change(symbol) {
//   var search = "https://rest.coinapi.io/v1/assets/" + symbol + "?apikey=" + api;

//   var yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   var lastPriceSearch =
//     "https://rest.coinapi.io/v1/exchangerate/" +
//     symbol +
//     "/USD/?time=" +
//     yesterday.toISOString() +
//     "&apikey=" +
//     api;

//   const data = await fetch(search);
//   const DATA = await data.json();
//   const lastdata = await fetch(lastPriceSearch);
//   const LastData = await lastdata.json();
//   var change_data = (DATA[0].price_usd - LastData.rate) / 100;
// console.log(change_data);

//   return symbol + ": " + change_data.toFixed(2).toString() + "%";
// }

// async function top5() {
//   l1.textContent = calc_change("BTC");
//   l2.textContent = calc_change("ETH");
//   l3.textContent = calc_change("DOGE");
//   l4.textContent = calc_change("ADA");
//   l5.textContent = calc_change("DOT");
// }

// top5();

// Code for Search Crypto

search_button.onclick = function () {
  var tosearch =
    "https://rest.coinapi.io/v1/assets/" + search_data.value + "?apikey=" + api;
  var iconsearch =
    "https://rest.coinapi.io/v1/assets/icons/" +
    search_data.value +
    "?apikey=" +
    api;

  async function getData() {
    const data = await fetch(tosearch);
    const DATA = await data.json();

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var lastPriceSearch =
      "https://rest.coinapi.io/v1/exchangerate/" +
      search_data.value +
      "/USD/?time=" +
      yesterday.toISOString() +
      "&apikey=" +
      api;
    const lastdata = await fetch(lastPriceSearch);
    const LastData = await lastdata.json();

    const icondata = await fetch(iconsearch);
    const IconData = await icondata.json();

    console.log(IconData[1].url);

    if (DATA.length == 0) {
      alert("Error: Symbol does not exist!");
    } else {
      searchSYM.textContent = DATA[0].asset_id;
      searchNAME.textContent = DATA[0].name;
      currentPrice.textContent =
        DATA[0].price_usd.toFixed(2).toString() + " USD";
      lastPrice.textContent = LastData.rate.toFixed(2).toString() + " USD";
      var change_data = (DATA[0].price_usd - LastData.rate) / 100;
      if (change_data < 0) {
        change.style.color = "#FF0000";
        sign = "-";
      } else {
        change.style.color = "#00FF00";
        sign = "+";
      }
      change.textContent =
        sign + Math.abs(change_data).toFixed(2).toString() + "%";

      for (let i = 0; i < IconData.length; i++) {
        if (IconData[i].asset_id == search_data.value) {
          cryptoImage.src = IconData[i].url;
        } else {
          cryptoImage.src =
            "https://upload.wikimedia.org/wikipedia/commons/b/b4/Circle_question_mark.png";
        }
      }
      resultsDisplay.style.visibility = "visible";
    }
  }
  getData();
};
