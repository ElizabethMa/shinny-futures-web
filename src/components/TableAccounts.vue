<template>
    <div class="accounts-container">
        <el-row class="row-head">
            <el-col v-for="(item, index) in showFields[0]" :key="index" :span="4">
                <div class="grid-content">{{ fieldsName[item] }}</div>
            </el-col>
        </el-row>
        <el-row class="row-body" >
            <el-col v-for="(item, index) in showFields[0]" :key="index" :span="4">
                <div class="grid-content">{{ account[item] }}</div>
            </el-col>
        </el-row>
        <el-row class="row-head">
            <el-col v-for="(item, index) in showFields[1]" :key="index" :span="4">
                <div class="grid-content">{{ fieldsName[item] }}</div>
            </el-col>
        </el-row>
        <el-row  class="row-body">
            <el-col v-for="(item, index) in showFields[1]" :key="index" :span="4">
                <div class="grid-content">{{ account[item] }}</div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        'showFields': [
          ['balance', 'available', 'pre_balance', 'deposit', 'withdraw', 'commission'],
          ['static_balance', 'position_profit', 'float_profit', 'close_profit', 'margin', 'risk_ratio']
        ],
        'fieldsName': { // 字段名称
          'balance': '账户权益',
          'available': '可用资金',
          'pre_balance': '账户权益',
          'deposit': '入金金额',
          'withdraw': '出金金额',
          'commission': '手续费',
          'premium': '权利金',
          'static_balance': '静态权益',
          'position_profit': '持仓盈亏',
          'float_profit': '浮动盈亏',
          'risk_ratio': '风险度',
          'margin': '占用资金',
          'frozen_margin': '冻结保证金',
          'frozen_commission': '冻结手续费',
          'frozen_premium': '冻结权利金',
          'close_profit': '平仓盈亏'
        }
      }
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters({
        account: 'accounts/GET_ACCOUNT'
      })
    }
  };
</script>
<style scoped lang="scss">
    .accounts-container {
        padding: 2px;
        font-size: 14px;
        width: 100%;
    }
    .el-row {
        &:first-child {
            border-top: 1px solid #dcdcdc;
        }
        .el-col {
            border-right: 1px solid #dcdcdc;
            border-bottom: 1px solid #dcdcdc;
            &:first-child {
                border-left: 1px solid #dcdcdc;
            }
            .grid-content {
                min-height: 26px;
                display: flex;
                align-items: center;
            }
        }

        &.row-head .el-col{
            background: #f5f7fa;
            .grid-content {
                justify-content: center;
            }
        }
        &.row-body .el-col {
            .grid-content {
                padding-right: 6px;
                justify-content: flex-end;
            }
        }
    }
</style>
