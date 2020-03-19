// import { prototype } from "vue/types/umd"

// plugin.js专门负责提供小函数以及vue中常用的过滤器
export default {
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    // 自定义一个函数名
  }
}
