// //  webpack 

// const { resolve } = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
// const ESLintPlugin = require('eslint-webpack-plugin')

// //  配置nodejs环境
// // process.env.NODE_ENV = 'development'
// process.env.NODE_ENV = 'production'

// //  postcssLoader
// const postcssLoader = {
//     loader: 'postcss-loader',
//     options: {
//         postcssOptions: {
//             plugins: ['postcss-preset-env']
//         }
//     }
// }

// /*
//     tree shaking：去除无用代码
//     前提：1、必须使用ES6模块化  2、开启production环境
//     在package.json中配置
//         "sideEffects":false     表示所有代码都没有副作用（都可以进行tree shaking）
//     问题：可能会把css/@babel/polyfill（副作用）文件干掉

//     解决办法：
//     在package.json中配置"sideEffects"
//         "sideEffects"：["*.css"]
// */

// module.exports = {
//     //  打包入口文件
//     //  将html文件添加到入口，用来解决html文件不能热更新的问题
//     //  但是只有一个html文件，所以不需要热更新功能
//     entry: ['./src/index.js'],

//     //  文件输出路径
//     output: {
//         filename: 'bundle.[contenthash:8].js',
//         path: resolve(__dirname, 'build')
//     },

//     //  打包规则
//     module: {
//         rules: [
//             //  配置eslint
//             //  eslint不认识浏览器的全局变量 window、navigator等
//             //  解决：在package.json中eslintConfig配置   "env":{"browser":true} 
//             // {
//             //     test: /\.js$/,
//             //     exclude: /node_modules/,
//             //     enforce: 'pre',
//             //     loader: 'eslint-loader',
//             //     options: {
//             //         fix: true
//             //     }
//             // },
//             //  一下loader只会匹配一个
//             {
//                 //  oneOf优化构建打包速度
//                 oneOf: [
//                     {
//                         test: /\.css$/,
//                         use: [
//                             // MiniCssExtractPlugin.loader,
//                             'style-loader',
//                             'css-loader',
//                             postcssLoader
//                         ]
//                     },
//                     {
//                         test: /\.less$/,
//                         use: [
//                             // MiniCssExtractPlugin.loader,
//                             'style-loader',
//                             'css-loader',
//                             postcssLoader,
//                             'less-loader'
//                         ]
//                     },
//                     {
//                         test: /\.(jpg|png|gif|svg)$/,
//                         loader: 'url-loader',
//                         options: {
//                             limit: 8 * 1024
//                         }
//                     },
//                     {
//                         test: /\.html$/,
//                         loader: 'html-loader'
//                     },
//                     // 配置babel
//                     {
//                         test: /\.js$/,
//                         exclude: /node_modules/,
//                         loader: 'babel-loader',
//                         options: {
//                             presets: ['@babel/preset-env'],
//                             //  开启babel缓存，第二次构建时会读取之前的缓存，构建速度更快
//                             //  babel缓存   和  给文件名添加哈希值（每次webpack打包都会生成一个哈希值）  一起使用,
//                             //  解决修改源文件的时候浏览器会使用新的打包好的文件，而不是直接读取缓存文件

//                             //  新的问题： 因为js和css同时使用一个hash值，如果重新打包（只修改一个文件的时候），会导致所有缓存失效
//                             //  解决办法：chunkhash：根据chunk生成的hash值，如果打包来源于同一个chunk，那么hash值就一样

//                             //  新的问题： js和css的hash值还是一样的，因为css是在js中被引入的，所以同属于一个chunk

//                             //  解决颁发：contenhash：根据文件的内容生成hash值，不同文件的hash值一定不一样
//                             cacheDirectory: true
//                         }
//                     }
//                 ]
//             }

//         ]
//     },

//     //  压缩css文件
//     optimization: {
//         minimize: true,
//         minimizer: [
//             new CssMinimizerWebpackPlugin()
//         ]
//     },

//     //  功能插件
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: './src/index.html'
//         }),
//         new MiniCssExtractPlugin()
//     ],

//     //  使用模式
//     // mode: 'development',
//     mode: 'production',

//     //  配置开发服务器
//     devServer: {
//         contentBase: './build',
//         compress: true,
//         port: 3000,
//         open: true,
//         //  开启HMR功能
//         hot: true
//     },
//     //  配置target
//     target: process.env.NODE_ENV === 'development' ? 'web' : 'browserslist',

//     //  配置source-map 源码与构建后的代码之间的映射， 用以调式追踪代码错误
//     //  [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
//     devtool: 'eval-source-map'

//     //  除了inline和eval单独和source-map结合使用产生的映射文件是内联的，其他都生成外部的文件

//     // 开发环境: 速度快（eval>inline>cheap>...），调式友好

//     //  速度快
//     //  eval-cheap-suorce-map
//     //  eval-source-map

//     //  调式更友好
//     //  source-map
//     //  cheap-modele-source-map
//     //  cheap-source-map

//     //  -->eval-source-map  / eval-cheap-module-source-map

//     // 生产环境：源代码是否隐藏，调式是否更友好
//     // 内联会让源代码体积更大
//     // 隐藏源代码   nosources-source-map（全部隐藏）    /   hidden-source-map（之隐藏源代码，会提示构建后代码错误信息）
//     // --> 直接使用（调试友好） source-map  /  cheap-module-source-map
// }
//  __________________________________________________________________________


//  webpack  代码分割

const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const webpack = require('webpack')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

/*
    PWA:渐进式网络开发应用程序（离线可访问）
    workbox --> workbox-webpack-plugin
*/

// const postcssLoader = {
//     loader: 'postcss-loader',
//     options: {
//         postcssOptions: {
//             plugins: ['postcss-preset-env']
//         }
//     }
// }

module.exports = {
    //   单入口
    entry: ['./src/index.js'],

    //  配置多个打包入口
    //  有一个入口，最红输出就有一个bundle
    //  有多个入口就会有多个bundle
    // entry: {
    //     main: './src/index.js',
    //     test: './src/test.js'
    // },

    //  文件输出路径
    output: {
        //  配置文件命，这里的变量name会根据entry中的对象名称来取值
        filename: '[name].[contenthash:8].js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            //  配置eslint
            //  eslint不认识浏览器的全局变量 window、navigator等
            //  解决：在package.json中eslintConfig配置   "env":{"browser":true} 
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     enforce: 'pre',
            //     loader: 'eslint-loader',
            //     options: {
            //         fix: true
            //     }
            // },
            //  一下loader只会匹配一个
            {
                //  oneOf优化构建打包速度
                oneOf: [
                    {
                        test: /\.css$/i,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: {}
                            },
                            // 'style-loader',
                            'css-loader',
                            // postcssLoader
                            'postcss-loader'
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            // 'style-loader',
                            'css-loader',
                            // postcssLoader,
                            'postcss-loader',
                            'less-loader'
                        ]
                    },
                    {
                        // test: /\.(jpg|png|gif|svg)$/,
                        // use: [
                        //     {
                        //         loader: 'url-loader',
                        //         options: {
                        //             // outputPath: 'img',
                        //             //  也可以写成下方的形式，会自动生成imgs目录
                        //             name: 'imgs/[hash:8].[ext]',
                        //             // 在使用url-loader时，如果不加限制，则使用base64将全部图片打包
                        //             //  file-loader 没有将图片使用base64打包的功能
                        //             //  一般小图片才使用base64
                        //             limit: 10 * 1024
                        //         }
                        //     }
                        // ],


                        //  使用 asset module type(资源模块类型),通过添加四种新的模块类型，
                        //  来替换 [raw|url|file]-loader
                        //  asset/resouce   发送一个单独的文件并导出 url，之前通过使用 file-loader 实现
                        //  asset/inline    导出一个资源的data URL。之前通过使用 url-loader 实现
                        //  asset/source    导出资源的源码。之前通过 raw-loader 实现
                        //  asset   在导出一个data URL 和发送一个单独的文件之间自动选择。之前通过url-loader实现，
                        //  通过配置资源体积限制实现
                        test: /\.(jpg|png|gif|svg)$/,
                        type: "asset",
                        generator: {
                            // 注意取到的资源名会包含一个点,所以后置不需要加点了
                            filename: "img/[name]_[hash:6][ext]"
                        },
                        parser: {
                            dataUrlCondition: {
                                maxSize: 1 * 1024
                            }
                        }
                    },
                    {
                        test: /\.html$/,
                        use: {
                            loader: 'html-loader',
                            options: {
                                esModule: false
                            }
                        },
                    },
                    // 配置babel
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            /*  
                            开启多进程打包
                            缺点：进程启动大概为600ms，进程通信也有开销

                            用处：只有工作消耗时间比较长，才需要多进程打包
                              */
                            {
                                loader: "thread-loader",
                                options: {
                                    workers: 2   //开启进程个数
                                }
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    // presets: ['@babel/preset-env'],
                                    //  开启babel缓存，第二次构建时会读取之前的缓存，构建速度更快
                                    //  babel缓存   和  给文件名添加哈希值（每次webpack打包都会生成一个哈希值）  一起使用,
                                    //  解决修改源文件的时候浏览器会使用新的打包好的文件，而不是直接读取缓存文件

                                    //  新的问题： 因为js和css同时使用一个hash值，如果重新打包（只修改一个文件的时候），会导致所有缓存失效
                                    //  解决办法：chunkhash：根据chunk生成的hash值，如果打包来源于同一个chunk，那么hash值就一样

                                    //  新的问题： js和css的hash值还是一样的，因为css是在js中被引入的，所以同属于一个chunk

                                    //  解决颁发：contenhash：根据文件的内容生成hash值，不同文件的hash值一定不一样
                                    cacheDirectory: true
                                }
                            }
                        ],
                    }
                ]
            }

        ]
    },
    //  功能插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new WorkboxWebpackPlugin.GenerateSW({
            /*
                1、帮助serviceworker快速启动
                2、删除旧的serviceworker

                此插件会生成一个serviceworker配置文件，在入口文件中对该配置文件进行配置。
                且sw代码必须运行在服务器上，所以需要启动服务器

                npm i serve -g 安装serve模块,可以快速创建一个服务器
                serve -s build （此处build为启动的文件目录）启动服务器 ，将build目录下所有资源作为讲台资源爆露出去
            */
            clientsClaim: true,
            skipWaiting: true
        }),
        // //  告诉webpack那些库不参与打包，同时使用时的名称也得变化
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, 'dll/manifest.json')
        }),
        // //  将某个文件打包出去，并且在html中自动引入该资源
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, 'dll/jquery.js')
        }),
        //  抽取css文件
        new MiniCssExtractPlugin({
            filename: 'myCss/[name].[contenthash:8].css',
            // chunkFilename:'[id].css'
        })
    ],
    /* 
        splitChunks：
            1、可以将node_modules中代码单独打包成一个chunk文件输出
            2、自动的分析多入口chunk中的公共文件，将多个chunk用到的公共文件单独打包成一个chunk
            （可以解决，重复打包公共文件的问题）
    */
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    //  使用模式
    // mode: 'development',
    mode: 'production',

    //  忽略打包对象
    externals: {
        //  jQuery不打包，手动通过cdn引入jQuery
        jquery: 'jQuery'
    },
    //  配置解析模块规则
    resolve: {
        //  配置模块解析路径别名
        alias: {
            cpns: resolve(__dirname, 'src/components')
        },
        //  配置省略文件路径的后缀名
        extensions: ['.js', '.json', '.jsx', '.css'],
        //  告诉webpack解析模块的时候去找那个目录
        modules: [resolve(__dirname, './node_modules'), 'node_modules']
    },
    //  配置开发服务器
    devServer: {
        //  运行代码的目录
        contentBase: './build',
        //  监视 contentBase 目录下的所有文件，一旦文件变化就会 reload
        watchContentBase: true,
        //  忽略文件
        watchOptions: {
            ignored: /node_modules/
        },
        compress: true,
        port: 3000,
        //  域名
        host: 'localhost',
        open: true,
        //  开启HMR功能
        hot: true,
        //  是否显示启动服务器日志信息
        clientLogLevel: 'none',
        //  处理一些进本启动信息意外，其他内容都不要显示
        quiet: true,
        //  如果出现错了，不要全屏提示~
        overlay: false,
        //  服务器代理  --> 解决开发环境的跨域问题
        proxy: {
            //  一旦devServer（3000）服务器接收到/api/xxx的请求，就会把请求转发到另外一个服务器（端口号为4000）
            '/api': {
                target: 'http://localhost:4000',
                //  发送请求时，请求路径重写：将 /api/xxx --> /xxx  (去掉/api)
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
}