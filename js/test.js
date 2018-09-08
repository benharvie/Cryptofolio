const getTxInfo = function() {
  let info = JSON.parse(httpGET('https://blockchain.info/rawtx/65a7b3fe3753fd7ce96b1debbd406530a9ce0573a00f6aaa8bfc0e863cef2e9f'))
  return info.out.value;
}

const httpGET = function(url) {
  var http = new XMLHttpRequest();
  http.open('GET', url, false);
  http.send();
  return http.responseText;
}

console.log(getTxInfo());
