<template>
     <el-table v-if="quotesList.length > 0"
            :data="quotes(this.quotesList)"
            size="mini"
            :height="height"
            border
            :header-cell-style="{'text-align':'center'}"
            v-loading="loading"
            @row-click="rowClick"
            @row-dblclick="rowDbClick"
            @row-contextmenu="rowContextmenu"
            :cell-style="cellStyle">
        <el-table-column label="合约代码" width="100" fixed>
            <template slot-scope="scope"> 
               <!-- { row, column, $index } -->
               <div >{{scope.row.ins_name}}</div>
               <div class="appendix" v-if="scope.row.class==='FUTURE'">{{scope.row.ins_id}}</div>
               <div class="appendix" v-if="scope.row.class==='FUTURE_INDEX'">{{scope.row.underlying_product}}</div>
               <div class="appendix" v-if="scope.row.class==='FUTURE_CONT'">{{scope.row.underlying_symbol}}</div>
            </template>
        </el-table-column>
        <el-table-column
                prop="last_price"
                label="最新价"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="datetime"
                label="时间"
                align="right"
                width="100"
                :formatter="formatterDatetime">
        </el-table-column>
        <el-table-column
                prop="bid_price1"
                label="买价"
                align="right"
                width="70"
                class-name="col-buy"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="bid_volume1"
                label="买量"
                align="right"
                width="50"
                class-name="col-buy">
        </el-table-column>
        <el-table-column
                prop="ask_price1"
                label="卖价"
                align="right"
                width="70"
                class-name="col-sell"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="ask_volume1"
                label="卖量"
                align="right"
                width="50"
                class-name="col-sell">
        </el-table-column>
        <el-table-column
                prop="change"
                label="涨跌"
                align="right"
                width="60"
                :formatter="formatterChange">
        </el-table-column>
        <el-table-column
                prop="change_percent"
                label="涨跌幅"
                align="right"
                width="60"
                :formatter="formatterChangePercent">
        </el-table-column>
        <el-table-column
                prop="volume"
                label="成交量"
                align="right"
                width="70">
        </el-table-column>
        <el-table-column
                prop="open"
                label="今开盘"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="close"
                label="收盘"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="upper_limit"
                label="涨停"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="lower_limit"
                label="跌停"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="highest"
                label="最高价"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="lowest"
                label="最低价"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="open_interest"
                label="持仓量"
                align="right"
                width="70">
        </el-table-column>
        <el-table-column
                prop="pre_open_interest"
                label="昨持"
                align="right"
                width="70">
        </el-table-column>
        <el-table-column
                prop="pre_volume"
                label="昨成交"
                align="right"
                width="70">
        </el-table-column>
        <el-table-column
                prop="pre_close"
                label="昨收"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="pre_settlement"
                label="昨结算"
                align="right"
                width="70"
                :formatter="formatterPrice">
        </el-table-column>
    </el-table>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {FormatDatetime, FormatPrice} from '@/plugins/utils'
  export default {
    data() {
      return {
        watchersList: [],
        // quotesList: []
      }
    },
    props: {
      quotesList: {
        type: Array,
      },
      height: {
        type: String,
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    beforeMount() {
        console.log('beforeMount', this.quotes.length, this.watchersList.length, this.quotesList.length)
    },
    mounted() {
        console.log('mounted', this.quotes.length, this.watchersList.length, this.quotesList.length)
    },
    beforeUpdate() {
        console.log('beforeUpdate', this.quotes.length, this.watchersList.length, this.quotesList.length)
    },
    updated() {
        console.log('updated', this.quotes.length, this.watchersList.length, this.quotesList.length)
    },
    beforeDestroy () {
        console.log('beforeDestroy')
    },
    watch: {
        'quotesList': {
            handler: function (val, oldVal) {
                // console.log(val.length, oldVal.length)
                // this.watchersList = []
                // console.log(this.quotesList, this.watchersList.length)
                // let q = []
                // for (var i = 0; i < this.quotesList.length; i++) {
                //     let symbol = this.quotesList[i]
                //     let watcher = this.$watch(function () {
                //         return this.$root.dm.quotes[symbol]
                //     }, (function(i) {
                //         return function (val, oldVal) {
                //             q[i] = val
                //         }
                //     })(i), {
                //         deep:true
                //     })
                //     this.watchersList.push(watcher)
                // }
                // this.quotes = q
            }
        }
    },
    computed: {
      ...mapGetters({
        quotes: 'quotes/GET_QUOTES_BY_LIST'
      })
    },
    methods: {
        formatterDatetime (row, column, cellValue, index) {
            return cellValue.slice(11, 23)
        },
        formatterPrice (row, column, cellValue, index) {
            return FormatPrice(cellValue, row.price_decs)
        },
        formatterChange(row, column, cellValue, index) {
            return FormatPrice(row.change, row.price_decs)
        },
        formatterChangePercent(row, column, cellValue, index) {
          if (row.change === '-') return '-'
          let percent = row.change / row.pre_settlement * 100
          return FormatPrice(percent) + '%'
        },
        rowClick (row, event, column) {
          if (row.class === 'FUTURE'){
            let symbol = row.instrument_id
            this.$store.commit('SET_SELECTED_SYMBOL', symbol)
          }
        },
        rowDbClick (row, event) {
          this.$router.push({ name: 'stock', params: { instrument_id: row.instrument_id }})
        },
        cellStyle ({row, column, rowIndex, columnIndex}) {
          if (['最新价', '涨跌', '涨跌幅', '今开盘', '最高价', '最低价'].includes(column.label) && row.change%1 === 0 && row.change !== 0) {
            return {
              color: row.change > 0 ? 'red' : 'green' 
            }
          } 
          return {
            color: 'black'
          }
        },
        rowContextmenu (row, event) {
            event.stopPropagation()
            event.preventDefault()
            row.doing = true
        }
    }
  }
</script>

<style lang="scss">

  td div.appendix {
    font-size: smaller;
    line-height: 12px;
  }

  td.col-buy {
    background-color: #fff0f0
  }
  td.col-sell {
    background-color: #f0fff0
  }

</style>
