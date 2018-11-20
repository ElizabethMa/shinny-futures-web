import TqWebSocket from './websocket'
import { QuotesServerUrl } from '@/configs'
const QuoteWs = new TqWebSocket(QuotesServerUrl)
export default QuoteWs
