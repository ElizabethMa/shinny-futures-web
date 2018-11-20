<template>
    <el-table
            :data="orders"
            size="mini"
            :height="height"
            :header-cell-style="{'text-align':'center'}"
            border
            stripe
            :default-sort = "{prop: 'insert_date_time', order: 'descending'}"
            @row-click="rowClick">
        <el-table-column
                prop="order_id"
                label="委托单ID"
                width="180">
        </el-table-column>
        <el-table-column
                prop="instrument_id"
                label="合约代码"
                align="center"
                width="70">
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
                prop="volume_orign"
                label="手数"
                align="right"
                width="50">
        </el-table-column>
        <el-table-column
                prop="limit_price"
                label="价格"
                align="right"
                width="70">
        </el-table-column>
        <el-table-column
                prop="volume_left"
                label="未成交"
                align="right"
                width="60">
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
                <el-button v-if="scope.row.status === 'ALIVE'"
                  size="mini"
                  @click="handleCancelOrder(scope.$index, scope.row)">撤单</el-button>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="100"
            :filters="[{ text: '未完成', value: 'ALIVE' }, { text: '已完成', value: 'FINISHED' }]"
            :filter-method="filterStatus"
            filter-placement="bottom-end" 
            :formatter="formatterStatus">
        </el-table-column>
        <el-table-column
                prop="insert_date_time"
                label="下单时间"
                align="right"
                :formatter="formatterDatetime"
                width="160">
        </el-table-column>
        <el-table-column
                prop="last_msg"
                label="提示"
                align="right"
                width="180">
        </el-table-column>
    </el-table>
</template>

<script>
import {mapGetters} from 'vuex'
import {FormatDatetime, FormatPrice, FormatDirection, FormatOffset, FormatStatus} from '@/plugins/utils'

export default {
    data() {
      return {};
    },
    props: {
        height: {
            type: String,
        }
    },
    mounted() {},
    computed: {
      ...mapGetters({
        orders: 'orders/GET_ORDERS'
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
        filterStatus (value, row) {
            return row.status === value
        },
        handleCancelOrder (index, row) {
            this.$store.commit('CANCEL_ORDER', {
              order_id: row.order_id
            })
        },
        rowClick (row, event, column) {
          let symbol = row.exchange_id + '.' + row.instrument_id
          this.$store.commit('SET_SELECTED_SYMBOL', symbol)
        }
    }
}
</script>
