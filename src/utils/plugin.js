// import { prototype } from "vue/types/umd"

// plugin.js专门负责提供小函数以及vue中常用的过滤器
import dayjs from 'dayjs' // yinru dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间插件
import 'dayjs/locale/zh-cn'// 引入语言包（默认支持英文语言包）
dayjs.extend(relativeTime) // 相当于dayjs扩展相对时间
export default {
  install (Vue) {
    // 自定义一个函数名
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 定义一个原型属性 $sleep 所有组件都有了这个属性
    // 用过滤器（全局、局部）
    // Vue.filter('名称'，函数)
    Vue.filter('relTime', relTime) // 注册全局过滤器
  }
}
// 休眠函数
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
// 此函数用来将日期转化成相对时间
function relTime (data) {
  return dayjs().locale('zh-cn').from()
}
