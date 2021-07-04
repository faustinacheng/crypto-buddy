var api = '27EEA12D-527D-43E0-A88D-DFA8031D977D';
var search_button = document.getElementById('button');
var search_data   = document.getElementById('search_data');
var searchSYM     = document.getElementById('id');
var searchNAME    = document.getElementById('name');
var currentPrice  = document.getElementById('current-price');
var lastPrice     = document.getElementById('last-day-price');
var change        = document.getElementById('change');
var cryptoImage   = document.getElementById('cryptoImage');
var resultsDisplay= document.getElementById('resultsDisplay');

resultsDisplay.style.visibility = "hidden";

search_button.onclick = function()
{
  var tosearch = "https://rest.coinapi.io/v1/assets/" + search_data.value + "?apikey=" + api;
  var iconsearch = "https://rest.coinapi.io/v1/assets/icons/" + search_data.value + "?apikey=" + api;
  
  async function getData() {

    const data = await fetch(tosearch);
    const DATA = await data.json();
    
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate()- 1);
    var lastPriceSearch = "https://rest.coinapi.io/v1/exchangerate/" + search_data.value + "/USD/?time=" + yesterday.toISOString() + "&apikey=" + api;
    const lastdata = await fetch(lastPriceSearch);
    const LastData = await lastdata.json();

    const icondata = await fetch(iconsearch);
    const IconData = await icondata.json();

    if(DATA.length == 0){
      alert("Error: Symbol does not exist!");
    }
    else{
      searchSYM.textContent = DATA[0].asset_id;
      searchNAME.textContent = DATA[0].name;
      currentPrice.textContent = DATA[0].price_usd.toFixed(2).toString() + " USD";
      lastPrice.textContent = LastData.rate.toFixed(2).toString() + " USD";
      var change_data = (DATA[0].price_usd - LastData.rate)/100;
      if (change_data < 0){
        change.style.color = "#FF0000";
      }
      else{
        change.style.color = "#00FF00";
      }
      change.textContent = change_data.toFixed(2).toString() + "%";
      
      for (let i = 0; i < IconData.length; i++){
          if (IconData[i].asset_id == search_data.value){
              cryptoImage.src = IconData[i].url;
          }}
    resultsDisplay.style.visibility = "visible";
    }}
  getData();
}
