const search_button = document.getElementById("button");
const searchWrapper = document.querySelector(".search-wrapper");
const searchBar = document.querySelector(".searchbar");
const search_data = document.getElementById("search_data");
const searchAutoResults = document.getElementById("searchAutoResults");
const searchSYM = document.getElementById("id");
const searchNAME = document.getElementById("name");
const currentPrice = document.getElementById("current-price");
const marketCap = document.getElementById("market-cap");
const marketCap24hr = document.getElementById("market-cap-24hr");
const high24hr = document.getElementById("high-24hr");
const low24hr = document.getElementById("low-24hr");
const price24hr = document.getElementById("price-24hr");
const price7d = document.getElementById("price-7d");
const price1h = document.getElementById("price-1h");
const cryptoImage = document.getElementById("cryptoImage");
const resultsDisplay = document.getElementById("resultsDisplay");

const numberFormat = new Intl.NumberFormat("en-US");

// Code for Trending

const listItems = document.getElementsByClassName("list-item");

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
    coins_json.sort(dynamicSort("symbol"));

    symbolToID = coins_json;
  });
};

function dynamicSort(property) {
  let sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
}

getCoinsList();

// const searchCoins = (searchText) => {
//   console.log("C" + symbolToID);
// let matches = symbolToID.filter((coin) => {
//   const regex = new RegExp(`^${searchText}`, "gi");
//   return coin.name.match(regex) || coin.symbol.match(regex);
// });

// if (search_data.value.length === 0) {
//   searchBar.style.borderBottomRightRadius = "24px";
//   searchBar.style.borderBottomLeftRadius = "24px";
//   matches = [];
//   searchAutoResults.innerHTML = "";
// }

// console.log(matches);

// outputHtml(matches);
// };

// search_data.addEventListener("input", () => {
//   searchCoins(search_data.value);
// });

// const outputHtml = (matches) => {
//   console.log("B" + symbolToID);
//   if (matches.length > 0) {
//     const html = matches
//       .map(
//         (match) => `
//     <div class="autocomplete-entry">
//       <span class="autocomplete-symbol">${match.symbol}</span> <span class="autocomplete-name">${match.name}</span>
//     </div>
//     `
//       )
//       .join("");

//     searchAutoResults.innerHTML = html;
//     searchBar.style.borderBottomRightRadius = "0px";
//     searchBar.style.borderBottomLeftRadius = "0px";
//   }
// };`

let currentFocus;

search_data.addEventListener("input", (e) => {
  let a,
    b,
    i,
    val = search_data.value;
  closeAllLists();
  if (!val) {
    return false;
  }
  // currentFocus = -1;

  a = document.createElement("DIV");
  a.setAttribute("id", "search_data" + "autocomplete-list");
  a.setAttribute("class", "autocomplete-items");

  searchWrapper.appendChild(a);

  let rankedIndex = symbolToID
    .map((entry) => {
      let points = 0;
      const regexExact = new RegExp(`^${val}$`, "gi");
      const regex = new RegExp(`^${val}`, "gi");

      if (entry.name.match(regexExact) || entry.symbol.match(regexExact)) {
        points += 2;
      } else if (entry.name.match(regex) || entry.symbol.match(regex)) {
        points += 1;
      }

      return { ...entry, points };
    })
    .sort((a, b) => b.points - a.points)
    .filter((entry) => entry.points > 0);

  for (i = 0; i < rankedIndex.length; i++) {
    searchBar.style.borderBottomRightRadius = "0px";
    searchBar.style.borderBottomLeftRadius = "0px";
    b = document.createElement("DIV");
    b.setAttribute("onClick", `getData('${rankedIndex[i].id}', 2)`);
    b.innerHTML = `
        <span class="autocomplete-symbol">${rankedIndex[i].symbol}</span> <span class="autocomplete-name">${rankedIndex[i].name}</span>
        `;

    b.innerHTML +=
      "<input type='hidden' value='" +
      rankedIndex[i].symbol.toUpperCase() +
      "'>";

    b.addEventListener("click", function (e) {
      search_data.value = this.getElementsByTagName("input")[0].value;

      closeAllLists();
    });
    a.appendChild(b);
  }
});

search_data.addEventListener("keydown", function (e) {
  let x = document.getElementById(this.id + "autocomplete-list");
  if (x) x = x.getElementsByTagName("div");
  if ("Escape" === e.key) {
    closeAllLists();
  }
  // if (e.keyCode == 40) {
  //   /*If the arrow DOWN key is pressed,
  //     increase the currentFocus variable:*/
  //   currentFocus++;
  //   /*and and make the current item more visible:*/
  //   addActive(x);
  // } else if (e.keyCode == 38) {
  //   //up
  //   /*If the arrow UP key is pressed,
  //     decrease the currentFocus variable:*/
  //   currentFocus--;
  //   /*and and make the current item more visible:*/
  //   addActive(x);
  // } else if (e.keyCode == 13) {
  //   /*If the ENTER key is pressed, prevent the form from being submitted,*/
  //   // e.preventDefault();
  //   if (currentFocus > -1) {
  //     /*and simulate a click on the "active" item:*/
  //     if (x) x[currentFocus].click();
  //   }
  // }
});
// function addActive(x) {
//   /*a function to classify an item as "active":*/
//   if (!x) return false;
//   /*start by removing the "active" class on all items:*/
//   removeActive(x);
//   if (currentFocus >= x.length) currentFocus = 0;
//   if (currentFocus < 0) currentFocus = x.length - 1;
//   /*add class "autocomplete-active":*/
//   x[currentFocus].classList.add("autocomplete-active");
// }
// function removeActive(x) {
//   /*a function to remove the "active" class from all autocomplete items:*/
//   for (let i = 0; i < x.length; i++) {
//     x[i].classList.remove("autocomplete-active");
//   }
// }
function closeAllLists(elmnt) {
  const x = document.getElementsByClassName("autocomplete-items");
  for (let i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != search_data) {
      x[i].parentNode.removeChild(x[i]);
      searchBar.style.borderBottomRightRadius = "1.25em";
      searchBar.style.borderBottomLeftRadius = "1.25em";
    }
  }
}

document.addEventListener("click", function (e) {
  closeAllLists(e.target);
});

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
