<template>
    <div class="quotes-container">
      <div class="row" :style="{width:rowWidth}">
        <div class="col" v-for="(item, index) in tags" :key="index">
          <el-button size="mini" :type="type(item)" @click="handlerClickTag(item)">{{item}}</el-button>
        </div>
      </div>
      <!-- <table-quotes :quotesList="quotesList" :height="tableHeight" />  -->
      <table-quotes :contentList="quotesList" :tableCol="quotesTableRow" :rootPath="rootPath" :height="tableHeight"/>
    </div>
</template>
<script>
// import TableQuotes from '@/components/TableQuotes.vue'
import TableQuotes from '@/components/Table/Table.vue'
import { QuotesTableRow } from '@/configs'
export default {
  name: 'quotes',
  components: {
      TableQuotes
  },
  data () {
    return {
      tags: this.$store.state.tags,
      selectedTag: this.$route.params.tag,
      quotesTableRow: QuotesTableRow,
      rootPath: 'quotes/'
    }
  },
  computed: {
    quotesList: function () {
      let list = this.$store.state.tagsQuotesMap[this.selectedTag]
      this.$store.commit('SUBSCRIBE_QUOTE', list)
      return list
    },
    rowWidth: function () {
      let lengthOfWords = this.$store.state.tags.join('').length
      let lengthOfTags = this.$store.state.tags.length
      return lengthOfWords * 12.5 + lengthOfTags * 20 
    },
    tableHeight: function () {
      return (this.$store.state.quotesViewHeight - 30) + 'px'
    }
  },
  methods: {
    type: function (item) {
      return item === this.selectedTag ? 'primary' : ''
    },
    handlerClickTag: function (tag) {
      this.selectedTag = tag
      this.$router.replace({ name: 'quotes', params: { tag }}) 
    }
  }
}
</script>
<style scoped lang="scss">
.quotes-container {
  .row {
    padding-top: 2px;
    height: 28px;
    overflow-x: hidden;
    overflow-y: hidden;
    .col {
      height: 32px;
      font-size: 12px;
      display: inline-block;
      padding: 2px 4px;
      .el-button {
        border-radius: 0px;
        padding: 2px 6px;
        block-size: 22px;
      }
    }
  }
  }

</style>
