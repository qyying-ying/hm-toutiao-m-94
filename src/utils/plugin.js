// import { prototype } from "vue/types/umd"

// plugin.js专门负责提供小函数以及vue中常用的过滤器
export default {
  install (Vue) {
    // 自定义一个函数名
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 定义一个原型属性 $sleep 所有组件都有了这个属性
  }
}
// 休眠函数
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
