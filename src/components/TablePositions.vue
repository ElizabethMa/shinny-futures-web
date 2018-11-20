<template>
    <el-table
            :data="positions"
            size="mini"
            :height="height"
            :header-cell-style="{'text-align':'center'}"
            border
            v-loading="loading"
            @row-click="rowClick">
        <el-table-column
                prop="instrument_id"
                label="合约代码"
                fixed
                width="80">
        </el-table-column>
        <el-table-column
                prop="last_price"
                label="最新价"
                align="right"
                fixed
                width="80">
        </el-table-column>
        <el-table-column
                prop="volume_long"
                label="多仓"
                align="right"
                class-name="col-buy"
                width="50">
        </el-table-column>
        <el-table-column
                prop="open_price_long"
                label="开仓均价"
                align="right"
                class-name="col-buy"
                width="80"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="position_profit_long"
                label="持仓盈亏"
                align="right"
                class-name="col-buy"
                width="80"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column label="操作" width="150"  class-name="col-buy">
            <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  :disabled="scope.row.volume_long === 0"
                  @click="handleClose(scope.$index, scope.row, 'SELL')">平仓</el-button>
                <el-button
                  size="mini"
                  type="success"
                  :disabled="scope.row.volume_long === 0"
                  @click="handleCloseOpen(scope.$index, scope.row, 'SELL')">反手</el-button>
          </template>
        </el-table-column>
        <el-table-column
                prop="volume_short"
                label="空仓"
                align="right"
                class-name="col-sell"
                width="50">
        </el-table-column>
        <el-table-column
                prop="open_price_short"
                label="开仓均价"
                width="80"
                align="right"
                class-name="col-sell"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column
                prop="position_profit_short"
                label="持仓盈亏"
                align="right"
                class-name="col-sell"
                width="80"
                :formatter="formatterPrice">
        </el-table-column>
        <el-table-column label="操作" width="150"  class-name="col-sell">
            <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  :disabled="scope.row.volume_short === 0"
                  @click="handleClose(scope.$index, scope.row, 'BUY')">平仓</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  :disabled="scope.row.volume_short === 0"
                  @click="handleCloseOpen(scope.$index, scope.row, 'BUY')">反手</el-button>
          </template>
        </el-table-column>
        <el-table-column
                prop="margin"
                label="持仓占用"
                align="right"
                width="80"
                :formatter="formatterPrice">
        </el-table-column>
    </el-table>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {FormatPrice} from '@/plugins/utils'
  export default {
    data() {
      return {};
    },
    props: {
      height: {
        type: String,
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    mounted() {},
    computed: {
      ...mapGetters({
        positions: 'positions/GET_POSITIONS'
      })
    },
    methods: {
        formatterPrice (row, column, cellValue, index) {
            return FormatPrice(cellValue)
        },
        handleClose (index, row, direction) {
            let quote = this.$store.getters['quotes/GET_QUOTE'](row.exchange_id + '.' + row.instrument_id)
            let volume = direction === 'BUY' ? row.volume_short : row.volume_long
            this.$store.commit('INSERT_ORDER', {
              symbol: quote.instrument_id, 
              exchange_id: quote.exchange_id,
              ins_id: quote.ins_id,
              direction: direction,
              offset: 'CLOSE',
              limitPrice: quote.last_price,
              volume: volume
            })
        },
        handleCloseOpen (index, row, direction) {
            let quote = this.$store.getters['quotes/GET_QUOTE'](row.exchange_id + '.' + row.instrument_id)
            let volume = direction === 'BUY' ? row.volume_short : row.volume_long
            this.$store.commit('INSERT_ORDER', {
              symbol: quote.instrument_id, 
              exchange_id: quote.exchange_id,
              ins_id: quote.ins_id,
              direction: direction,
              offset: 'CLOSE',
              limitPrice: quote.last_price,
              volume: volume
            })
            this.$store.commit('INSERT_ORDER', {
              symbol: quote.instrument_id, 
              exchange_id: quote.exchange_id,
              ins_id: quote.ins_id,
              direction: direction,
              offset: 'OPEN',
              limitPrice: quote.last_price,
              volume: volume
            })
        },
        rowClick (row, event, column) {
          let symbol = row.exchange_id + '.' + row.instrument_id
          this.$store.commit('SET_SELECTED_SYMBOL', symbol)
        }
    }
  }
</script>
