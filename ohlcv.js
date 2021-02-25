const http = require('http'); //Pode-se usar tanto http como https
//var express = require('express');
//var app = express();
const ccxt = require('ccxt');

let bittrex = new ccxt.bittrex()
//var ohlcv
//teste(ohlcv)
//console.log(ohlcv)

//https://stackoverflow.com/questions/23667086/why-is-my-variable-unaltered-after-i-modify-it-inside-of-a-function-asynchron
let ohlcv = async () => {
	return await bittrex.fetch_ohlcv('BTC/USDT', '1d', '100')
}

(async function main () {
	await ohlcv()
	console.log(ohlcv)
})()

//function teste() {
// (async function teste(obj) => {
// 	let bittrex = new ccxt.bittrex()
//
// 	obj = await bittrex.fetch_ohlcv('BTC/USDT', '1d', '100')
// })();
//}

// var app = http.createServer(function(req,res){
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify(ohlcv));
// });
// app.listen(3000, '127.0.0.1');

// http.createServer(function (req, res) {
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');
//
// console.log('Server running at http://127.0.0.1:1337/');


// http.get('https://yobit.net/api/3/ticker/btc_usd', (resp) => {
//   let data = '';
//
//   // A chunk of data has been recieved.
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });
//
//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     console.log(JSON.parse(data).btc_usd.high);
//   });
//
// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });