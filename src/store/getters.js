export default {
  getBrokers: (state) => {
    return state.brokers
  },
  getSelectedInstrumentId: (state, getters) => {
    return state.selectSymbol
  }
}
