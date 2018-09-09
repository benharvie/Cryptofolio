// FUTURE FEATURES
// - custom date/time
// - add sell option
// - buy/sell colour coding
// - delete transaction button
// - format money: https://www.npmjs.com/package/money-formatter

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
  return { amount: (info['out'][0].value / 100000000), time: new Date(info['time'] * 1000) }; // NEED TO REFACTOR, NOT EPOCH?
}

const roundToTwo = function(value) {
  return(Math.round(value * 100) / 100);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#purchase_form');
  form.addEventListener('submit', handleSubmit);

  const selectCrypto = document.querySelector('#crypto_currency');
  selectCrypto.addEventListener('change', handleCryptoChange);

  const selectGlobal = document.querySelector('#global_currency');
  selectGlobal.addEventListener('change', handleGlobalChange);

  const selectTxForm = document.querySelector('#tx_form');
  selectTxForm.addEventListener('submit', handleTxSubmit);
});

const handleSubmit = function() { // Apply to table - Cleanup, assign repeated values to variables first, then this.reset()
  event.preventDefault();

  const dataTable = document.createElement('tr');
  const coinPrice = getPrice(this.crypto_currency.value, this.global_currency.value)
  dataTable.innerHTML = `<td>${(new Date()).toString().split(' ').splice(1,3).join(' ')}</td>
                       <td>${this.crypto_currency.value}</td>
                       <td>${roundToTwo(this.amount.value)}</td>
                       <td>${currencySymbol(this.global_currency.value)}${roundToTwo(this.total_price.value)}</td>
                       <td>${currencySymbol(this.global_currency.value)}${roundToTwo((this.total_price.value / this.amount.value))}</td>
                       <td>${currencySymbol(this.global_currency.value)}${coinPrice}</td>
                       <td>${currencySymbol(this.global_currency.value)}${roundToTwo(coinPrice - (this.total_price.value / this.amount.value))}</p></td>
                       <td><a class="delete is-medium"></a></td>
                       </tr>
                      `

  const formResult = document.querySelector('table');
  formResult.appendChild(dataTable);

  const totalPurchaseValue = document.querySelector('#total_purchase_value')
  totalPurchaseValue.textContent = Number(totalPurchaseValue.textContent.replace('£', '')) + Number(roundToTwo(this.total_price.value))
  totalPurchaseValue.textContent = '£' + totalPurchaseValue.textContent

  const totalProfitValue = document.querySelector('#total_profit')
  totalProfitValue.textContent = Number(totalProfitValue.textContent.replace('£', '')) + Number(roundToTwo(coinPrice - (this.total_price.value / this.amount.value)));
  totalProfitValue.textContent = '£' + totalProfitValue.textContent;

  if (this.crypto_currency.value === 'Bitcoin') {
      const btcTotal = document.querySelector('#total_btc');
      btcTotal.textContent = roundToTwo(Number(this.amount.value) + Number(btcTotal.textContent));
  } else if (this.crypto_currency.value === 'Litecoin') {
      const ltcTotal = document.querySelector('#total_ltc')
      ltcTotal.textContent = roundToTwo(Number(this.amount.value) + Number(ltcTotal.textContent));
  } else if (this.crypto_currency.value === 'Ethereum') {
      const ethTotal = document.querySelector('#total_eth')
      ethTotal.textContent = roundToTwo(Number(this.amount.value) + Number(ethTotal.textContent));
  }

  this.reset();
}

const handleTxSubmit = function() {
  event.preventDefault();
  // const txSubmitBtn = document.querySelector('#tx_submit') // Loading button concept
  // txSubmitBtn.classList.add('is-loading');

  const txID = document.querySelector('#tx_id');
  const info = getTxInfo(txID.value);
  // const time = info.time;

  this.reset(); // reset before grabbing info, quicker

  document.querySelector('#amount').value = roundToTwo(info.amount);
  document.querySelector('#total_price').value = roundToTwo(getPrice('Bitcoin', 'GBP') * info.amount);

  // txSubmitBtn.classList.remove('is-loading');
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
