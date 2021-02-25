//OBS:
//Se você trabalhar com sats, é mais preciso do que trabalhar com fiat.
//Pois nem todas exchanges possuem a cotação ou o par em dólar, assim tendo
//que buscar a cotação em outras exchanges, deixando o código redundante.

//Você tem que encontrar uma crypto com o gráfico mais volátil possível em um dia
//e que possua um bom volume de compra e venda.

//Algoritimo:
//1-Comprar ou vender uma Crypto
//  1.1-Acima ou abaixo de uma margem de 1000 sats (Parametrizado)
//2-Armazenar (preço, data e hora) que foi comprada (MongoDB)
//3-Ciclo:
//  3.1-Verificar a cada 1 minuto se o preço bateu o target de venda ou compra (MongoDB)
//  3.2-Se atingir o target, vende ou compra.
//4-Inteligência:
//  4.1-Se der overbought na RSI, ele ajusta a margem automaticamente, caso ocorra uma consolidação

//Para parar o console com o loop em execução é só digitar: CTRL + C

//CCXT é uma biblioteca responsável pela traduçao e deserializaão das APIs de várias exchanges suportadas
const ccxt = require('ccxt');
require('ansicolor').nice;

let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms))

//Se usar 'await' a função precisa ser declarada como 'async'
let retornarDadosExchange = async (nome, par) => {
        //debugger
        let exchange = new ccxt[nome] ({ enableRateLimit: true })
        let ticker = await exchange.fetchTicker (par)
        let limiteRequisicoes = exchange.rateLimit
        //let fees = await exchange.fetchFees() //Não está funcionando
        //--let precoSolicitado = ticker.bid
        //--let volumeCriptoBase = ticker.baseVolume

        var dados = [ticker.bid, ticker.baseVolume, limiteRequisicoes]
        return dados
}

let recuperarTiker = async (exchanges, pares) => {
    for (let p = 0; p < pares.length; p++) { //Para cada par 
        for (let i = 0; i < exchanges.length; i++) { //Para cada exchange
            let dados = await retornarDadosExchange(exchanges[i], pares[p])
            console.log(exchanges[i].green, pares[p].yellow, dados[0], dados[1])

            //Cálculo dos Spreads
            for (let j = 0; j < exchanges.length; j++) {
                if (exchanges[i] != exchanges[j]) { //Verifica se o nome da exchange é diferente do item anterior no array
                    let dadosProxExchanges = await retornarDadosExchange(exchanges[j], pares[p])
                    let spread = dados[0] - dadosProxExchanges[0]

                    if (spread > 0) { //Não mostra spreads negativos
                        console.log("Spread: ", exchanges[i].green + " => " + exchanges[j].yellow, spread)
                    }

                    //Delay:
                    await sleep (dados[2] + 3000)
                }
            }
        }
    }

    //Delay:
    //--await sleep (limiteRequisicoes + 3000)

    //Mostra o Json Parseado com todas as propriedades
    //console.log(exchange); //Sempre que tiver uma propriedade no Json assim: load_markets: [Function: loadMarkets] é para codificar como: exchange.load_markets()
    //console.log(ticker);

    //Fees:
    //Não tem a propriedade da taxa de Witdrawall ainda. Você precisa pegar no site de cada exchange.
    //  https://github.com/ccxt/ccxt/issues/40
    //Somente traz as fees Maker e Taker, pois estas divergem muito de exchange para exchange e de cripto para cripto
    //console.log(fees); //Não está funcionando
    //Testar:
    //  exchange.calculate_fee()

    //Mostra o Json Parseado com todas as propriedades de apenas um par
    //  Fees: maker, taker
    //  info.MinTradeSize: Quantidade Mínimo para Trade
    //console.log(exchange.market(par))

    //Saída Principal
    //--console.log(id[i].green, par.yellow, precoSolicitado, volumeCriptoBase)
    //--console.log(id[i].green, par.yellow, dados[0], dados[1])
    //--console.log(id[i].green, par.yellow, ticker.bid, ticker.baseVolume)
}

(async () => {

    //Os pares são divididos em Base e Quote. Por exemplo BTC/USDT, Base: BTC / Quote: USDT
    const btcusd = 'BTC/USD'
    const btcusdt = 'BTC/USDT'
    const ethusdt = 'ETH/USDT'
    const ltcusdt = 'LTC/USDT'
    const xmrusdt = 'XMR/USDT'
    const iotabtc = 'IOTA/BTC'

    //Precisa de 'await' senão ocorre o erro: Promise { <pending> }
    //--while (true) {
        var exchanges = ["kraken"];
        //var exchanges = ["bittrex", "poloniex", "kraken"];
        var pares = ["BTC/USD"]
        //var pares = ["BTC/USDT", "BCH/USDT", "ETH/USDT", "LTC/USDT", "XMR/USDT"]

        console.log('--Tickers--')
        await recuperarTiker(exchanges, pares)

        //exchange.rateLimit:
        //  bittrex: 1500
        //  poloniex: 1000
        //  kraken: 3000
        //  binance: 1000
    //--}

    //Mostra todas as exchanges suportadas
    //console.log(ccxt.exchanges);
})();
