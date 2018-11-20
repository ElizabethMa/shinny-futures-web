<template>
  <el-dialog
      width="80%"
      title="确认结算单"
      :lock-scroll="false"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible="visible">
      <div class="confirm-container">
        <pre>{{confirmContent}}</pre>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clickOk">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    props: {},
    computed: {
      visible () {
        return this.$store.state.confirm === 'doing'
      },
      confirmContent () {
        return this.$store.state.confirmContent
      }
    },
    methods: {
      clickOk: function () {
        this.$store.commit('CONFIRM_SETTLEMENT')
      }
    }
  }
</script>
<style scoped lang="scss">
.confirm-container {
  overflow: scroll;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
