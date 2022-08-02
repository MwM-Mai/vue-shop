const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 发布优化  把main.js 改成 main-dev.js 和 main-prot.js 两个同样内容 的文件
  // 判断如果是 发布模式 添加 main-prot.js 入口文件
  // 如果是 开发模式 添加 main-dev.js 入口文件
  
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      // 默认情况下，依赖项的所有第三方包都会被打包到js/chunk-vendors.******.js文件中，导致该js文件过大
      // 那么我们可以通过externals排除这些包，使它们不被打包到js/chunk-vendors.******.js文件中
      config.set('externals',{
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        nprogress:'NProgress',
        'vue-quill-editor':'VueQuillEditor'
      })

      //使用插件
      config.plugin('html').tap(args=>{
        //添加参数isProd
        args[0].isProd = true
        return args
      })
    }) 

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    }) 
  }
})
