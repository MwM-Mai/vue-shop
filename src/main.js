import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入字体图标 使用自定义图标
import './assets/image/fonts/iconfont.css'

// 导入全局样式 否者全局样式无法生效
import "@/assets/css/global.css"


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
