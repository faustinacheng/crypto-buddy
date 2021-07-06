var api = "86BD34C5-A59B-4D68-B6C1-CECC1275E7A3";
// var api = "52FE8C2C-9ACD-44BC-BE63-F362B9AF4B17";
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

var list = [document.getElementById("l1"), document.getElementById("l2"), document.getElementById("l3"), document.getElementById("l4"), document.getElementById("l5")];

async function calc_change(name){
  const data = await fetch("https://api.coincap.io/v2/assets/"+name);
  const DATA = await data.json();

  var SYM = DATA.data.symbol;
  var USD = DATA.data.priceUsd;
  var PER = DATA.data.changePercent24Hr;
  var res = [SYM.toString(), USD, PER];
  return res;
};

async function top5(){
  var res = [calc_change("bitcoin"), calc_change("ethereum"), calc_change("dogecoin"), calc_change("tether"), calc_change("binance-coin")];
  for(let i=0; i<5 ; i++){
    res[i].then(
      function(value){
        list[i].textContent = value[0] + " : " + parseFloat(value[1]).toFixed(2).toString() + "$ : " + parseFloat(value[2]).toFixed(2).toString() + "%";
      });}};

setInterval(top5, 1000);

// Code for Search Crypto

document.querySelector("#search_data").addEventListener("keyup", (event) => {
  if (event.key !== "Enter") return;
  document.querySelector("#button").click();
  event.preventDefault();
});

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

    if (DATA.length == 0) {
      alert("Error: Symbol does not exist!");
    } else {
      searchSYM.textContent = DATA[0].asset_id;
      searchNAME.textContent = DATA[0].name;
      currentPrice.textContent =
        DATA[0].price_usd.toFixed(2).toString() + " USD";
      lastPrice.textContent = LastData.rate.toFixed(2).toString() + " USD";
      var change_data =
        ((DATA[0].price_usd - LastData.rate) / LastData.rate) * 100;
      if (change_data < 0) {
        change.style.color = "#FF0000";
      } else {
        change.style.color = "#00FF00";
      }
      change.textContent =
        change_data.toFixed(2).toString() + "%";

      for (let i = 0; i < IconData.length; i++) {
        if (IconData[i].asset_id == search_data.value) {
          cryptoImage.src = IconData[i].url;
          break;
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
