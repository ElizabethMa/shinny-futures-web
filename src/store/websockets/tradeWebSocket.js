import TqWebSocket from './websocket'
import { TradeServerUrl } from '@/configs'
const TradeWs = new TqWebSocket(TradeServerUrl)
export default TradeWs
