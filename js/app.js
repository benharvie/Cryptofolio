const getPrice = function(cryptoCurrency, globalCurrency) {
  let currencyID
  const http = new XMLHttpRequest();

  if (cryptoCurrency === 'Bitcoin') {
      currencyID = 1;
  } else if (cryptoCurrency === 'Litecoin') {
      currencyID = 2;
  } else if (cryptoCurrency === 'Ethereum') {
      currencyID = 1027;
  }

  http.open('GET', `https://api.coinmarketcap.com/v2/ticker/${currencyID}/?convert=GBP&limit=10/`, false);
  http.send();
  response = JSON.parse(http.responseText);

  let price
  if (globalCurrency === 'USD') {
    price = roundToTwo(response.data.quotes.USD.price);
  } else if (globalCurrency === 'GBP') {
    price = roundToTwo(response.data.quotes.GBP.price);
  }
  return price;
}

const getAcronym = function(currency) {
  let acronym
  if (currency === 'Bitcoin') {
      acronym = 'BTC';
  } else if (currency === 'Litecoin') {
      acronym = 'LTC';
  } else if (currency === 'Ethereum') {
      acronym = 'ETH';
  }
  return acronym;
}

const currencySymbol = function(currency) {
  let symbol
  if (currency === 'USD') {
    symbol = '$';
    console.log(currency);
  } else if (currency === 'GBP') {
    symbol = '£';
  }
  return symbol
}

function roundToTwo(value) {
  return(Math.round(value * 100) / 100);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#main_form');
  form.addEventListener('submit', handleSubmit);

  const selectCrypto = document.querySelector('#crypto_currency')
  selectCrypto.addEventListener('change', handleCryptoChange);

  const selectGlobal = document.querySelector('#global_currency')
  selectGlobal.addEventListener('change', handleGlobalChange);
});

const handleSubmit = function() {
  event.preventDefault();

  const newTile = document.createElement('div');
  const coinPrice = getPrice(this.crypto_currency.value, this.global_currency.value)
  newTile.className = 'level-item';
  newTile.id = this.crypto_currency.value
  newTile.innerHTML = `<p class="title">${this.crypto_currency.value}&nbsp&nbsp&nbsp</p>
                       <br>
                       <br>
                       <p class="heading"><b>Date:</b> ${(new Date()).toString().split(' ').splice(1,3).join(' ')}
                       <br>
                       <b>Amount:</b> ${roundToTwo(this.amount.value)}
                       <br>
                       <b>Purchase value:</b> ${currencySymbol(this.global_currency.value)}${roundToTwo(this.total_price.value)}
                       <br>
                       <b>Price paid/coin:</b> ${currencySymbol(this.global_currency.value)}${roundToTwo((this.total_price.value / this.amount.value))}
                       <br>
                       <b>Market value/coin:</b> ${currencySymbol(this.global_currency.value)}${coinPrice}
                       <br>
                       <b>Profit:</b> ${currencySymbol(this.global_currency.value)}${roundToTwo(coinPrice - (this.total_price.value / this.amount.value))}</p>
                       <br>
                      `

  const formResult = document.querySelector('#folio');
  formResult.appendChild(newTile);
}

const handleCryptoChange = function() {
  const currency = document.querySelector('#crypto_currency');
  const unit = document.querySelector('#crypto_unit');
  unit.textContent = getAcronym(crypto_currency.value);
}

const handleGlobalChange = function() {
  const currency = document.querySelector('#global_currency');
  const unit = document.querySelector('#global_unit');
  unit.textContent = currencySymbol(global_currency.value);
}