import QuoteWs from './quotesWebSocket'
import TradeWs from './tradeWebSocket'

function WebSocketPlugin (store) {
  QuoteWs.addEventListener('message', message => {
    if (message.aid === 'rtn_data') {
      for (let i in message.data) { store.commit('MERGE_QUOTE_WS_DATA', message.data[i]) }
    }
    QuoteWs.send('{"aid":"peek_message"}')
  })
  TradeWs.addEventListener('message', message => {
    switch (message.aid) {
      case 'rtn_data':
        for (let i in message.data) {
          store.commit('MERGE_TRADE_WS_DATA', message.data[i])
        }
        TradeWs.send('{"aid":"peek_message"}')
        break
      case 'rtn_brokers':
        store.commit('SET_BROKERS', message.brokers)
    }
  })
  store.subscribe(mutation => {
    if (['LOGIN', 'INSERT_ORDER', 'CANCEL_ORDER', 'TRANSFER'].includes(mutation.type)) {
      TradeWs.send('{"aid":"peek_message"}')
    }
  })
}

export default WebSocketPlugin
