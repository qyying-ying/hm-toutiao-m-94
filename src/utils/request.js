import axios from 'axios'
import JSONBig from 'json-bigint' // 引入大数字插件
import store from '@/store' // 引入vuex中的store实例对象 相当于 组件中的 this.$store
import router from '@/router' // 引入router对象
// axios.defaults 是对原有默认值进行修改

// axios.create() // 相当于 new 了一个新的axios实例
const instance = axios.create({
// 构造参数 传入一些配置 和defaults一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础的请求地址
  // 此函数是后台响应回来 但是还没进入到axios的响应拦截器是执行 数组里可以写多个的处理函数
  transformRespose: [function (data) {
    //   data是后端响应回来的字符串
    // JSONBig.parse()
    return data ? JSONBig.parse(data) : {}
  }]

}) // 创建一个axios新实例

// token的注入  应该在请求之前啊 也就是请求拦截器
// instance是一个新的axios实例
instance.interceptors.request.use(function (config) {
// 成功的时候如何处理
// 读取配置信息 给配置信息中注入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 将token统一注入到headers中
  }
  // 不用 if else的用法
  // config.headers.Authorization && (config.headers.Authorization = `Bearer ${store.state.user.token}`) // 将token 统一注入到headers中
  return config
}, function (error) {
// 直接返回 promise的错误
  return Promise.reject(error) // 返回错误 这样的话会直接进入到axios的catch中
})
// 用响应拦截器 处理 返回结果的数据  将多嵌套的结构 解构出来
instance.interceptors.response.use(function (response) {
// response实际上已经被 axios 默认包了一层数据  data才是 我们之前处理过的数据
// 几乎所有的返回数据都有一层data
  try {
    return response.data.data // 如果成功则直接返回 如果两层可以解开 就返回两层
  } catch (error) {
    // 如果失败 说明response.data不存在 如果两层解不开 就返回一层
    return response.data
  }
}, async function (error) {
// 如果请求失败或者失效或者其他错误 会进入到响应拦截器的错误区域
// 只要是401 就是token失效（应该用导航守卫将没有token的拦截在外面）
/***
 *error
 *   config 是出现这次错误请求的配置信息
 *   request 请求对象
 *   response 响应对象 status （状态码）
 */
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的地址
      }
    }
    // 如果状态码是401的话 就认为token失效了 就需要处理token失效问题
    // refresh_token 相当于一个续命的药
    if (store.state.user.refresh_token) {
      // 表示有续命的药
      // 如果有refresh_token 我们就用它换新token 需要调用舒心token的新接口
      // 发请求 得用工具？ 用instance还是axios？
      // 这里必须要用axios 因为现在token已经失效了 instance的拦截器还是会将失效的token 注入到headers中去
      // 需要用没有拦截器的axios 来发 刷新token的请求
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 完整的url地址
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` } // 在请求头中注入refresh_token
        })
        // await 后面就是promise执行完成的逻辑
        // 新token
        // 如果成功了 应该更新失效了的token
        // 直接更新vuex中的数据
        store.commit('updateUser', {
          //   载荷数据
          user: {
            // token
            token: result.data.data.token, // 最新的token
            refresh_token: store.state.user.refresh_token// 还是原来的refresh_token 14天之后过期
          }
        }) // 提交commit 更新vuex数据
        // 之所以回到这个位置 是因为401，也就意味着你之前的请求 是错误的
        // 需要把之前的错误请求再次发送出去 用 axios还是   instance？
        return instance(error.config) // 相当于执行之前 出现401的错误 返回这个请求的目的 是继续执行这个请求执行链下面的内容
        // JavaScript是单线程
      } catch (error) {
        // 如果失败意味着 你尝试去续命 可是续命失败
        // 重新登录 重新登录之前 需要删除掉 token 因为此时 token 失效 refresh_token也失效
        store.commit('delUser')
        // 重新跳到登录页面
        router.push(path)
      }
    } else {
      // 如果没有refresh_token 直接宣布over 直接跳到登录页面
      // router.push('/login') // 直接跳转到登录无可厚非，但是我们需要一种更复杂的场景
      // 如果由于 token失效,跳到登录页, 当前页面怎么办呢 ? 登录成功之后,跳转的还是这个页面吗? 不一定了吧！！
      // 我们要实现 你 在  A页面发请求 结果失效了  也没有refresh_token,只能回到 login, 你登录之后, 你希望回到A页面
      // 怎么做呢 ? 我们需要在跳到登录页中过程中 ,把当前页面的地址 传给 登录页面
      // 登录页面 登录成功能之后 先判断 有没有需要跳转的地址 如果没有跳到主页 如果有 跳到需要跳转的页面
      // router.currentRouter // 表示当前的路由信息对象 里面包含了路由的地址 和参数
      // 我们需要获取 当前路由的带参数的地址  router.currentRoute.fullPath(文档)
      store.commit('delUser') // 也要删除token 因为token失效了
      router.push(path)
    }
  }
  // 直接返回失败
  return Promise.reject(error) // 返回执行链的catch
})
export default instance
