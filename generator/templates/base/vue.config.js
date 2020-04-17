module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    port: 8091, // 端口号
    open: false, //配置自动启动浏览器
    proxy: {
      '/api': {
        target: '',
        ws: true,
        changeOrigin: true
      },
    }
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // 这里假设你有 `src/styles/variables.scss` 这个文件
        prependData: `@import "@/styles/_variables.scss";`
      }
    }
  }
}