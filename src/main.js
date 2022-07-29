import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引用了 vue-table-with-tree-grid 插件 实习商品分类的树形表格
import ZkTable from 'vue-table-with-tree-grid'
// 导入字体图标 使用自定义图标
import './assets/image/fonts/iconfont.css'

// 导入全局样式 否者全局样式无法生效
import "@/assets/css/global.css"


Vue.config.productionTip = false

// 手动注册 tree-table 为组成名称 ZkTable 为插件
Vue.component('tree-table', ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
