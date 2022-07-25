import Vue from 'vue'
import { Button } from 'element-ui'
// 因为在创建项目的时候 element-ui 设置的是按需导入 所有在用到组件的时候需要 引入
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 导入弹框提示 需要在全局挂载
import {Message} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 全局挂载
Vue.prototype.$message = Message

