<template>
    <el-container :style="{height:'100%'}">
        <el-aside>
            <el-form size="small" label-position="right" label-width="40px" id="trade">
                <h3 class="title">Shinny Tech ( {{$store.state.bid}} )</h3>
                <el-form-item label="合约">
                    <el-autocomplete
                      clearable
                      class="inline-input"
                      v-model="instrumentId"
                      :fetch-suggestions="querySearch"
                      @select="handleSelectInstrument"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="手数">
                    <el-input-number v-model="volume"/>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number :step="priceTick" :precision="priceDecs" :max="maxPrice" :min="minPrice" v-model="limitPrice"/>
                </el-form-item>
                <el-form-item>
                  <el-row>
                      <el-col :span="12">
                          <el-button size="small" plain @click="insertOrder('BUY', 'OPEN')">买开</el-button>
                      </el-col>
                      <el-col :span="12">
                          <el-button size="small" plain @click="insertOrder('SELL', 'OPEN')">卖开</el-button>
                      </el-col>
                      <el-col :span="12">
                          <el-button size="small" plain @click="insertOrder('BUY', 'CLOSE')">买平</el-button>
                      </el-col>
                      <el-col :span="12">
                          <el-button size="small" plain @click="insertOrder('SELL', 'CLOSE')">卖平</el-button>
                      </el-col>
                  </el-row>
                </el-form-item>
            </el-form>
        </el-aside>
        <el-main>
            <el-menu :default-active="selectedTab" class="el-menu-demo" mode="horizontal" @select="handleSelectTab">
                <el-menu-item index="accounts">账户</el-menu-item>
                <el-menu-item index="positions">持仓</el-menu-item>
                <el-menu-item index="orders">委托单</el-menu-item>
                <el-menu-item index="trades">成交记录</el-menu-item>
            </el-menu>
            <el-container class="tabs-container" :class="selectedTab">
                <table-accounts v-if="selectedTab === 'accounts'"/>
                <table-positions v-if="selectedTab === 'positions'" :height="tableHeight"/>
                <table-orders v-if="selectedTab === 'orders'" :height="tableHeight"/>
                <table-trades v-if="selectedTab === 'trades'" :height="tableHeight"/>
            </el-container>
        </el-main>
    </el-container>
</template>
<script>
  import {mapGetters} from 'vuex'
  import TableAccounts from "@/components/TableAccounts.vue"
  import TablePositions from "@/components/TablePositions.vue"
  import TableOrders from "@/components/TableOrders.vue"
  import TableTrades from "@/components/TableTrades.vue"

  export default {
    components: {
      TableAccounts,
      TablePositions,
      TableOrders,
      TableTrades
    },
    data() {
      return {
        selectedTab: 'accounts', // accounts positions orders trades
        volume: 1,
        priceTick: 1,
        limitPrice: 0,
        priceDecs: 0,
        maxPrice: Infinity,
        minPrice: 0
      };
    },
    mounted() {
      this.$store.subscribe((mutation, state) => {
        // 订阅事件，任何地方选中某行，都会更新这个组件
        if (mutation.type === 'SET_SELECTED_SYMBOL') {
          let quote = this.$store.getters['quotes/GET_QUOTE'](mutation.payload)
          if (quote) {
            this.priceTick = Number(quote.price_tick)
            this.limitPrice = Number(quote.last_price)
            this.priceDecs = Number(quote.price_decs)
            this.maxPrice = quote.upper_limit === 0 ? Infinity : Number(quote.upper_limit)
            this.minPrice = quote.lower_limit === 0 ? 0 : Number(quote.lower_limit)
          }
        }
      })
    },
    computed: {
      tableHeight(){
        // 减去 tabs-header
        console.log(this.$store.state.userViewHeight)
        return (this.$store.state.userViewHeight - 32) + 'px'
      },
      instrumentId: {
        get: function () {
          return this.innerInstrumentId
        },
        set: function (v) {
          this.$store.commit('SET_SELECTED_SYMBOL', v)
        }
      },
      ...mapGetters({
        innerInstrumentId: 'getSelectedInstrumentId'
      })
    },
    methods: {
      handleSelectTab (index, indexPath) {
        this.selectedTab = index;
      },
      querySearch (queryString, cb) {
        let results = queryString ? this.$store.getters['quotes/GET_QUOTES_BY_INPUT'](queryString) : []
        cb(results);
      },
      handleSelectInstrument (item) {},
      insertOrder (direction, offset) {
        let quote = this.$store.getters['quotes/GET_QUOTE'](this.instrumentId)
        this.$store.commit('INSERT_ORDER', {
          symbol: quote.instrument_id, 
          exchange_id: quote.exchange_id,
          ins_id: quote.ins_id,
          direction: direction,
          offset: offset,
          limitPrice: this.limitPrice,
          volume: this.volume
        })
      }
    }
  }
</script>
<style scoped lang="scss">
    .el-aside {
        z-index: 30;
        height: 100%;
        border-right: 1px solid #dedede;
        .title {
          text-align: center;
          color: #333333;
          margin: 15px auto;
        }
        .el-form#trade {
          // position: absolute;
          // bottom: 0;
            padding: 8px 12px;
            .el-form-item {
                margin-bottom: 10px;
            }
            .el-row .el-col {
                text-align: center;
                margin: 6px 0;
            }
            .el-autocomplete.inline-input {
              width: 100%
            }
            .el-input-number {
              width: 100%
            }
        }
    }
    .el-main {
        padding: 0;
        margin: 0;
        overflow: hidden;
    }
    .el-menu--horizontal>.el-menu-item {
        height: 32px;
        line-height: 32px;
    }
    .el-container.tabs-container {
        overflow: hidden;
        .el-table {
          margin-bottom: 0;
        }
    }
</style>
