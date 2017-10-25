// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Options from '@/components/options'

Vue.config.productionTip = false

Vue.component('options', Options)

/* eslint-disable no-new */
new Vue({
  el: '.f-app',
  router,
  template: '<App/>',
  components: { App }
})
