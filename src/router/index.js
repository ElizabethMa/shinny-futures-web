import Vue from 'vue'
import Router from 'vue-router'
import Quotes from '../view/quotes.vue'
import Charts from '../view/charts.vue'
import User from '../view/user.vue'
import Tags from '@/store/tags'

Vue.use(Router)

const DefaultTag = Tags[0].id

export default new Router({
  routes: [
    { path: '/', 
      redirect: '/quotes/' + DefaultTag },
    { path: '/quotes/:tag',
      name: 'quotes',
      components: {
        quotes: Quotes,
        user: User
      }
    }, 
    { path: '/stock/:instrument_id',
      name: 'stock',
      components: {
        quotes: Charts,
        user: User
      }
    },
    { path: '/*',
      redirect: '/quotes/' + DefaultTag
    }]
})
