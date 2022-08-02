import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 直接在 cdn 加载element-ui 实现项目发布优化
// import './plugins/element.js'

// 引用 vue-quill-editor 插件 实现富文本框编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
// 直接在 cdn 加载 实现项目发布优化
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'



// 注册为 全局可用的组件
Vue.use(VueQuillEditor)

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
