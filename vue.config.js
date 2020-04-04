// 需要导出一个对象
module.exports = {
// 需要更改less中的变量配置
  css: {
    //   less相关
    loaderOptions: {
    // 所有的关于样式loader相关的选项
      less: {
        // 这里的选项写什么？
        // modifyVars是less-loader的一个选项 通过这个选项可以改变变量的值
        modifyVars: {
        // 直接覆盖变量 变量名不需要@
          blue: '#3296fa'
        // 或者可以通过less文件覆盖（文件路径为绝对路径）
        }
      }
    }
  },
  configureWebpack: (config) => {
    // config参数就是当前vue-cli项目所有的webpack配置
    // 如果想要改动 直接修改这个信息就可以
    // 首先判断当前的打包环境是 开发环境还是生产环境
    if (process.env.NODE_ENV === 'production') {
      // 只需要在生产环境中 把所有的console删除掉并且再打包 这里的删除console不是删除源代码的console 而是删除打包出来的console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // 这个东西 是根据 webpack的配置得来的
    }
  },
  publicPath: './' // 打包后的引用地址
}
