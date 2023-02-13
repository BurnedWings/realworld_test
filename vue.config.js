const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 配置好的后端接口地址
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '' // 以'/api'开头的url会进行接口转发
        }
      },
    }
  }
})
