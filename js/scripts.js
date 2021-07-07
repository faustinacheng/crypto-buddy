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

var l1 = document.getElementById("l1");
var l2 = document.getElementById("l2");
var l3 = document.getElementById("l3");
var l4 = document.getElementById("l4");
var l5 = document.getElementById("l5");

async function get_trending() {
  let search = "https://api.coingecko.com/api/v3/search/trending";
  const trending = await fetch(search);
  const TRENDING = await trending.json();

  let trendingCoins = [];

  for (let i = 0; i < TRENDING.coins.length; i++) {
    trendingCoins.push(TRENDING.coins[i].item.id);
  }

  let itemSearch = "";
  let listdata = "";
  let ListData = "";
  let name, symbol;

  for (let i = 0; i < trendingCoins.length; i++) {
    itemSearch =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
      trendingCoins[i] +
      "&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d";
    listdata = await fetch(itemSearch);
    ListData = await listdata.json();

    name = ListData[0].name;
    symbol = ListData[0].symbol;
    let image = ListData[0].image;
    let price = ListData[0].current_price;
    let change24hr =
      ListData[0].price_change_percentage_24h_in_currency.toFixed(2);
    let change7d =
      ListData[0].price_change_percentage_7d_in_currency.toFixed(2);

    let trendingList = document.getElementById("trending-coins");
    var li = document.createElement("li");
    li.setAttribute("class", "list-item");

    trendingList.appendChild(li);
    li.innerHTML =
      li.innerHTML +
      `<div class="list-row list-rank">${
        i + 1
      }</div><img class="list-row list-icon" src=${image}/><div class="list-row list-symbol">${symbol}</div><div class="list-row list-name">${name}</div><div class="list-row list-price">${price}</div><div class="list-row change-24hr">${
        change24hr + "%"
      }</div><div class="list-row change-7d">${change7d + "%"}</div>`;
    var someList = document
      .getElementById("trending-coins")
      .getElementsByTagName("li");
    if (
      parseFloat(
        someList[i].getElementsByClassName("list-row change-24hr")[0].innerText
      ) < 0
    ) {
      someList[i].getElementsByClassName(
        "list-row change-24hr"
      )[0].style.color = "#f23a3a";
      someList[i].getElementsByClassName("list-row change-7d")[0].style.color =
        "#f23a3a";
    } else {
      var temp = someList[i].getElementsByClassName("list-row change-24hr")[0]
        .innerText;
      someList[i].getElementsByClassName("list-row change-24hr")[0].innerText =
        "+" + temp;
      someList[i].getElementsByClassName(
        "list-row change-24hr"
      )[0].style.color = "#1bb544";

      var temp =
        someList[i].getElementsByClassName("list-row change-7d")[0].innerText;
      someList[i].getElementsByClassName("list-row change-7d")[0].innerText =
        "+" + temp;
      someList[i].getElementsByClassName("list-row change-7d")[0].style.color =
        "#1bb544";
    }
  }
}

get_trending();

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
        change.style.color = "#f23a3a";
        sign = "-";
      } else {
        change.style.color = "#1bb544";
        sign = "+";
      }
      change.textContent =
        sign + Math.abs(change_data).toFixed(2).toString() + "%";

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
