import Vue from 'vue'
import './plugins/element'
import App from './app.vue'
import router from './router/index'
import store from './store/index'

Vue.config.productionTip = false
Vue.prototype.$tv_obj = undefined

store.dispatch('init')

new Vue({
    data: {
      name: 'tianqin-web',
      // dm: datamanager
    },
    router,
    store,
    render: h => h(App),
    beforeCreate: () => console.log('beforeCreate'),
    created: () => console.log('created'),
    beforeMount: () => console.log('beforeMount'),
    mounted: () => console.log('mounted'),
    beforeUpdate: () => console.log('beforeUpdate'),
    updated: () => console.log('updated'),
    activated: () => console.log('activated'),
    deactivated: () => console.log('deactivated'),
    beforeDestroy: () => console.log('beforeDestroy'),
    destroyed: () => console.log('destroyed'),
    errorCaptured: (err, vm, info) => console.log(info, err)
}).$mount('#app')
