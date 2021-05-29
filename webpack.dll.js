// 使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
// 当运行 webpack 时，默认查找webpack.config.js 配置文件
// 需求：运行webpack.dll.js文件
// 使用新命令运行： webpack --config webpack.dll.js

const { resolve } = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        jquery: ['jquery']
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dll'),
        library: '[name]_[hash:8]'  //  所打包的库向外曝露的名称
    },
    plugins: [
        // 打包生成一个 manifest.json --> 提供和jquery的映射关系
        new webpack.DllPlugin({
            name: '[name]_[hash:8]',   //   映射库的名称
            path: resolve(__dirname, 'dll/manifest.json')   //  输出文件的路径
        })
    ],
    mode: 'production'
}