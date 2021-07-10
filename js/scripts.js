let search_button = document.getElementById("button");
let search_data = document.getElementById("search_data");
let searchSYM = document.getElementById("id");
let searchNAME = document.getElementById("name");
let currentPrice = document.getElementById("current-price");
let marketCap = document.getElementById("market-cap");
let marketCap24hr = document.getElementById("market-cap-24hr");
let high24hr = document.getElementById("high-24hr");
let low24hr = document.getElementById("low-24hr");
let price24hr = document.getElementById("price-24hr");
let price7d = document.getElementById("price-7d");
let price1h = document.getElementById("price-1h");
let cryptoImage = document.getElementById("cryptoImage");
let resultsDisplay = document.getElementById("resultsDisplay");

let numberFormat = new Intl.NumberFormat("en-US");

// Code for Trending

let listItems = document.getElementsByClassName("list-item");

async function get_trending() {
  let search = "https://api.coingecko.com/api/v3/search/trending";
  const trending = await fetch(search, { dataType: "jsonp" });
  const TRENDING = await trending.json();

  let trendingCoins = [];

  for (let i = 0; i < TRENDING.coins.length; i++) {
    trendingCoins.push(TRENDING.coins[i].item.id);
  }

  let itemSearch = "";
  let listdata = "";
  let ListData = "";
  let name, symbol;

  async function refreshList() {
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
      let price = ListData[0].current_price.toLocaleString("en-US", {
        maximumSignificantDigits: 10,
      });
      let change24hr = ListData[0].price_change_percentage_24h_in_currency;
      let change7d = ListData[0].price_change_percentage_7d_in_currency;
      let id = trendingCoins[i];

      console.log(id);

      listItems[i].innerHTML = `<div class="list-row list-rank">${i + 1}</div>
      <img class="list-row list-icon" src="${image}" />
      <div class="list-name-container">
        <div class="list-row list-symbol" onClick="getData('${id}', 2)">${symbol}</div>
        <div class="list-row list-name">${name}</div>
      </div>
      <div class="list-row list-price">${price}</div>
      <div class="list-row change-24hr">${change24hr}</div>
      <div class="list-row change-7d">${change7d}</div>`;

      stylePosNeg(listItems[i].querySelector(".change-24hr"));

      stylePosNeg(listItems[i].querySelector(".change-7d"));
    }
  }
  // setInterval(refreshList, 1000);
  refreshList();
}
// setInterval(get_trending, 1000);
get_trending();

// Code for search results

document.querySelector("#search_data").addEventListener("keyup", (event) => {
  if (event.key !== "Enter") return;
  document.querySelector("#button").click();
  event.preventDefault();
});

let coinsListSearch =
  "https://api.coingecko.com/api/v3/coins/list?include_platform=false";

let symbolToID = [];

const getCoinsList = async () => {
  const response = await fetch(coinsListSearch);
  response.json().then((coins_json) => {
    symbolToID = coins_json;
  });
};

getCoinsList();

// search_button.onclick = function () {

async function getData(query, i) {
  let search_result = {};

  if (i == 1) {
    search_result = symbolToID.find((coin) => {
      return (
        coin.symbol.toLowerCase() === query.toLowerCase() ||
        coin.name.toLowerCase() === query.toLowerCase()
      );
    });
  } else if (i == 2) {
    search_result.id = query;
  }

  console.log(search_result);

  if (search_result == undefined) {
    displaySearchError();
  }

  let tosearch =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
    search_result.id +
    "&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";

  const data = await fetch(tosearch);
  const DATA = await data.json();

  if (DATA.length == 0) {
    displaySearchError();
  } else {
    let imageSrc = DATA[0].image
      ? DATA[0].image
      : "https://upload.wikimedia.org/wikipedia/commons/b/b4/Circle_question_mark.png";
    let symbol = DATA[0].symbol.toUpperCase();
    let name = DATA[0].name;
    let price = DATA[0].current_price.toLocaleString("en-US", {
      maximumSignificantDigits: 21,
    });
    let marketCap = DATA[0].market_cap.toLocaleString("en-US", {
      maximumSignificantDigits: 21,
    });
    let marketCap24h = DATA[0].market_cap_change_percentage_24h;
    let highLow = `${DATA[0].high_24h.toLocaleString("en-US", {
      maximumSignificantDigits: 8,
    })} / ${DATA[0].low_24h.toLocaleString("en-US", {
      maximumSignificantDigits: 8,
    })}`;
    let priceChange24hr = DATA[0].price_change_percentage_24h_in_currency;
    let priceChange7d = DATA[0].price_change_percentage_7d_in_currency;
    let priceChange1h = DATA[0].price_change_percentage_1h_in_currency;

    resultsDisplay.innerHTML = `<div class="title-wrapper">
      <img src=${imageSrc} id="cryptoImage" class="results-icon" />
      <div class="results-title-container">
        <div class="asset-code" id="id">${symbol}</div>
        <div class="asset-name" id="name">${name}</div>
      </div>
      </div>
      <div class="asset-prices-container">
      <div class="asset-row">
        <div class="asset-title asset-price">Current Price (USD):</div>
        <div class="asset-value" id="current-price">${price}</div>
      </div>
      <div class="asset-row">
        <div class="asset-title asset-1hr-price">1h Price Change:</div>
        <div class="asset-value" id="price-1h">${priceChange1h}</div>
      </div>
      <div class="asset-row">
        <div class="asset-title asset-24hr-price">
          24hr Price Change:
        </div>
        <div class="asset-value" id="price-24hr">${priceChange24hr}</div>
      </div>
      <div class="asset-row">
        <div class="asset-title asset-7d-price">7d Price Change:</div>
        <div class="asset-value" id="price-7d">${priceChange7d}</div>
      </div>
      <div class="asset-row">
        <div class="asset-title asset-highlow-24hr">
          24hr High/Low (USD):
        </div>
        <div class="asset-value" id="high-24hr">${highLow}</div>
      </div>
      <div class="asset-row">
        <div class="asset-title asset-market-cap">Market Cap:</div>
        <div class="asset-value" id="market-cap">${marketCap}</div>
      </div>
      <div class="asset-row">
        <div class="asset-title asset-market-cap-change">
          Market Cap 24hr Change:
        </div>
        <div class="asset-value" id="market-cap-24hr">${marketCap24h}</div>
      </div>
      </div>`;

    stylePosNeg(document.querySelector("#market-cap-24hr"));
    stylePosNeg(document.querySelector("#price-24hr"));
    stylePosNeg(document.querySelector("#price-7d"));
    stylePosNeg(document.querySelector("#price-1h"));
  }
}

function stylePosNeg(element) {
  if (element.textContent < 0) {
    element.style.color = "#f23a3a";
    caret = `<span class="material-icons" style="color: #f23a3a; font-size: 100%;">arrow_drop_down</span>`;
  } else {
    element.style.color = "#1bb544";
    caret = `<span class="material-icons" style="color: #1bb544; font-size: 100%;">arrow_drop_up</span>`;
  }
  element.innerHTML =
    caret + Math.abs(element.textContent).toFixed(2).toString() + "%";
}

function displaySearchError() {
  resultsDisplay.innerHTML = `<lottie-player id="error_image" src="images/not_found_face.json" background="transparent"  speed="1"  style="width: 82%; height: 82%;" loop autoplay></lottie-player>
  <div class="search-error">No results found.</div>
  `;
}
