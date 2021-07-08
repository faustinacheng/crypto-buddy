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

resultsDisplay.style.visibility = "hidden";

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
      let price = ListData[0].current_price;
      let change24hr = ListData[0].price_change_percentage_24h_in_currency;
      let change7d = ListData[0].price_change_percentage_7d_in_currency;

      listItems[i].innerHTML = `<div class="list-row list-rank">${
        i + 1
      }</div><img class="list-row list-icon" src=${image}/><div class="list-row list-symbol">${symbol}</div><div class="list-row list-name">${name}</div><div class="list-row list-price">${price}</div><div class="list-row change-24hr">${change24hr}</div><div class="list-row change-7d">${change7d}</div>`;

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

search_button.onclick = function () {
  async function getData() {
    let search_result = symbolToID.find((coin) => {
      return (
        coin.symbol.toLowerCase() === search_data.value.toLowerCase() ||
        coin.name.toLowerCase() === search_data.value.toLowerCase()
      );
    });

    let tosearch =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
      search_result.id +
      "&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";

    const data = await fetch(tosearch);
    const DATA = await data.json();

    if (DATA.length == 0) {
      alert("Error: Symbol does not exist!");
    } else {
      cryptoImage.src = DATA[0].image
        ? DATA[0].image
        : "https://upload.wikimedia.org/wikipedia/commons/b/b4/Circle_question_mark.png";
      searchSYM.textContent = DATA[0].symbol.toUpperCase();
      searchNAME.textContent = DATA[0].name;
      currentPrice.textContent = DATA[0].current_price.toLocaleString("en-US", {
        maximumSignificantDigits: 21,
      });
      marketCap.textContent = DATA[0].market_cap.toLocaleString("en-US", {
        maximumSignificantDigits: 21,
      });
      marketCap24hr.textContent = DATA[0].market_cap_change_percentage_24h;
      stylePosNeg(marketCap24hr);
      high24hr.textContent = `${DATA[0].high_24h.toLocaleString("en-US", {
        maximumSignificantDigits: 8,
      })} / ${DATA[0].low_24h.toLocaleString("en-US", {
        maximumSignificantDigits: 8,
      })}`;
      price24hr.textContent = DATA[0].price_change_percentage_24h_in_currency;
      stylePosNeg(price24hr);
      price7d.textContent = DATA[0].price_change_percentage_7d_in_currency;
      stylePosNeg(price7d);
      price1h.textContent = DATA[0].price_change_percentage_1h_in_currency;
      stylePosNeg(price1h);

      resultsDisplay.style.visibility = "visible";
    }
  }
  getData();
};

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
