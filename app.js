const getClassColour = function(currency) {
  if (currency === 'Bitcoin') {
      return 'tile is-child box notification is-warning';
  } else if (currency === 'Litecoin') {
      return 'tile is-child box notification is-primary';
  } else if (currency === 'Ethereum') {
      return 'tile is-child box notification is-info';
  }
}

const getPrice = function(currency) {
  const http = new XMLHttpRequest();
  let currencyID
  console.log(currency)
  if (currency === 'Bitcoin') {
      currencyID = 1
  } else if (currency === 'Litecoin') {
      currencyID = 2
  } else if (currency === 'Ethereum') {
      currencyID = 1027
  }

  http.open('GET', `https://api.coinmarketcap.com/v2/ticker/${currencyID}/`, false);
  http.send();
  response = JSON.parse(http.responseText);
  return roundToTwo(response.data.quotes.USD.price);
}

function roundToTwo(value) {
  return(Math.round(value * 100) / 100);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#main_form');
  form.addEventListener('submit', handleSubmit);
});

const handleSubmit = function() {
  event.preventDefault();

  const newTile = document.createElement('div');
  const coinPrice = getPrice(this.currency.value)
  newTile.className = getClassColour(this.currency.value);
  newTile.id = this.currency.value
  newTile.innerHTML = `<p class="title">${this.currency.value}</p>
                       <p class="subtitle"><b>Date:</b> ${(new Date()).toString().split(' ').splice(1,3).join(' ')}
                       <br>
                       <b>Amount:</b> ${roundToTwo(this.amount.value)}
                       <br>
                       <b>Purchase value:</b> $${roundToTwo(this.total_price.value)}
                       <br>
                       <b>Price paid/coin:</b> $${roundToTwo((this.total_price.value / this.amount.value))}
                       <br>
                       <b>Value at time:</b> $${coinPrice}
                       <br>
                       <b>Profit:</b> $${roundToTwo(coinPrice - (this.total_price.value / this.amount.value))}</p>`

  const formResult = document.querySelector('#folio');
  formResult.appendChild(newTile);
}
