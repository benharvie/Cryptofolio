// FUTURE FEATURES
// - import from txid - value/time - https://blockchain.info/rawtx/65a7b3fe3753fd7ce96b1debbd406530a9ce0573a00f6aaa8bfc0e863cef2e9f
// - custom date/time
// - add sell option
// - loop + sum total values for stats
// - buy/sell colour coding

const httpGET = function(url) {
  http = new XMLHttpRequest();
  http.open('GET', url, false);
  http.send();
  return http.responseText;
}

const getPrice = function(cryptoCurrency, globalCurrency) {
  let currencyID
  if (cryptoCurrency === 'Bitcoin') {
      currencyID = 1;
  } else if (cryptoCurrency === 'Litecoin') {
      currencyID = 2;
  } else if (cryptoCurrency === 'Ethereum') {
      currencyID = 1027;
  }

  let price
  const priceInfo = JSON.parse(httpGET(`https://api.coinmarketcap.com/v2/ticker/${currencyID}/?convert=GBP&limit=10/`));
  if (globalCurrency === 'USD') {
    price = roundToTwo(priceInfo.data.quotes.USD.price);
  } else if (globalCurrency === 'GBP') {
    price = roundToTwo(priceInfo.data.quotes.GBP.price);
  }
  return price;
}

const getAcronym = function(currency) {
  let acronym
  if (currency === 'Bitcoin') {
      acronym = 'ɃTC';
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

const getTxInfo = function(txID) {
  const info = JSON.parse(httpGET(`https://cors.io/?https://blockchain.info/rawtx/${txID}`));
  return { value: (info['out'][0].value / 100000000), time: new Date(info['time'] * 1000) }; // NEED TO REFACTOR, NOT EPOCH?
}

function roundToTwo(value) {
  return(Math.round(value * 100) / 100);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#purchase_form');
  form.addEventListener('submit', handleSubmit);

  const selectCrypto = document.querySelector('#crypto_currency')
  selectCrypto.addEventListener('change', handleCryptoChange);

  const selectGlobal = document.querySelector('#global_currency')
  selectGlobal.addEventListener('change', handleGlobalChange);
});

// const handleSubmit = function() {
//   event.preventDefault();
//
//   const newTile = document.createElement('div');
//   const coinPrice = getPrice(this.crypto_currency.value, this.global_currency.value)
//   newTile.className = 'level-item';
//   newTile.id = this.crypto_currency.value
//   newTile.innerHTML = `<p class="title">${this.crypto_currency.value}&nbsp;&nbsp;&nbsp;</p>
//                        <br>
//                        <br>
//                        <p class="heading"><b>Date:</b> ${(new Date()).toString().split(' ').splice(1,3).join(' ')}
//                        <br>
//                        <b>Amount:</b> ${roundToTwo(this.amount.value)}
//                        <br>
//                        <b>Purchase value:</b> ${currencySymbol(this.global_currency.value)}${roundToTwo(this.total_price.value)}
//                        <br>
//                        <b>Price paid/coin:</b> ${currencySymbol(this.global_currency.value)}${roundToTwo((this.total_price.value / this.amount.value))}
//                        <br>
//                        <b>Market value/coin:</b> ${currencySymbol(this.global_currency.value)}${coinPrice}
//                        <br>
//                        <b>Profit:</b> ${currencySymbol(this.global_currency.value)}${roundToTwo(coinPrice - (this.total_price.value / this.amount.value))}</p>
//                        <br>
//                       `
//
//   const formResult = document.querySelector('#folio');
//   formResult.appendChild(newTile);
// }
const handleSubmit = function() { // Table
  event.preventDefault();

  const newTile = document.createElement('tr');
  const coinPrice = getPrice(this.crypto_currency.value, this.global_currency.value)
  // newTile.className = 'level-item';
  // newTile.id = this.crypto_currency.value
  newTile.innerHTML = `<td>${(new Date()).toString().split(' ').splice(1,3).join(' ')}</td>
                       <td>${this.crypto_currency.value}</td>
                       <td>${roundToTwo(this.amount.value)}</td>
                       <td>${currencySymbol(this.global_currency.value)}${roundToTwo(this.total_price.value)}</td>
                       <td>${currencySymbol(this.global_currency.value)}${roundToTwo((this.total_price.value / this.amount.value))}</td>
                       <td>${currencySymbol(this.global_currency.value)}${coinPrice}</td>
                       <td>${currencySymbol(this.global_currency.value)}${roundToTwo(coinPrice - (this.total_price.value / this.amount.value))}</p></td>
                       </tr>
                      `

  const formResult = document.querySelector('table');
  formResult.appendChild(newTile);
}

const handleCryptoChange = function() {
  const currency = document.querySelector('#crypto_currency');
  const unit = document.querySelector('#crypto_unit');
  unit.textContent = getAcronym(crypto_currency.value);
}

const handleGlobalChange = function() {
  console.log(getTxInfo('f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16'));
  const currency = document.querySelector('#global_currency');
  const unit = document.querySelector('#global_unit');
  unit.textContent = currencySymbol(global_currency.value);
}
