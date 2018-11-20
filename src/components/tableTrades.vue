<template>

    <el-table
            :data="trades"
            size="mini"
            :height="height"
            :header-cell-style="{'text-align':'center'}"
            border
            stripe
            v-loading="loading">
        <el-table-column
                prop="order_id"
                label="委托单ID"
                width="180">
        </el-table-column>
        <el-table-column
                prop="exchange_trade_id"
                label="交易所单号"
                width="100">
        </el-table-column>
        <el-table-column
                prop="instrument_id"
                label="合约代码"
                width="100"
                :filters="filtersObj"
                :filter-method="filterInstrumentId"
                filter-placement="bottom-end">
        </el-table-column>
        <el-table-column
                prop="direction"
                label="方向"
                align="center"
                :formatter="formatterDirection"
                width="50">
        </el-table-column>
        <el-table-column
                prop="offset"
                label="开平"
                align="center"
                :formatter="formatterOffset"
                width="50">
        </el-table-column>
        <el-table-column
                prop="volume"
                label="手数"
                align="right"
                width="50">
        </el-table-column>
        <el-table-column
                prop="price"
                label="价格"
                align="right"
                width="70">
        </el-table-column>
        <el-table-column
                prop="trade_date_time"
                label="时间"
                :formatter="formatterDatetime"
                align="right"
                width="160">
        </el-table-column>
        <el-table-column
                prop="commission"
                label="手续费"
                align="right"
                width="80">
        </el-table-column>
    </el-table>
</template>

<script>
import {mapGetters} from 'vuex'
import {FormatDatetime, FormatPrice, FormatDirection, FormatOffset, FormatStatus} from '@/plugins/utils'

export default {
    data() {
      return {}
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
        trades: 'trades/GET_TRADES',
        filtersObj: 'trades/GET_TRADES_DISTINCT_INSID'
      })
    },
    methods: {
        formatterDatetime (row, column, cellValue, index) {
            return FormatDatetime(cellValue)
        },
        formatterPrice (row, column, cellValue, index) {
            return FormatPrice(cellValue)
        },
        formatterDirection (row, column, cellValue, index) {
            return FormatDirection(cellValue)
        },
        formatterOffset (row, column, cellValue, index) {
            return FormatOffset(cellValue)
        },
        formatterStatus (row, column, cellValue, index) {
            return FormatStatus(cellValue)
        },
        filterInstrumentId (value, row) {
            return row.instrument_id === value
        },
        handleCancelOrder (index, row) {
            this.$store.commit('CANCEL_ORDER', {
              order_id: row.order_id
            })
        }
    }
}
</script>