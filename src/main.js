import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 权限拦截模式
import store from './store'
import Vant from 'vant' // 引入vant组件库
import 'vant/lib/index.less' // 引入vant组件的样式 这里修改成less 因为有less才会修改某些变量
import 'amfe-flexible'
import '@/styles/Index.less' // 引入全局的自定义样式  因为要覆盖vant的样式
Vue.use(Vant) // 全局注册  实际上调用了 Vant导出的对象的方法  install方法
// 以上做法是完整导入，在项目开发阶段使用，配置方便节省时间，将来上线的时候可以使用按需导入。
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
