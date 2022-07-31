const path = require('path');
//首先引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development'; //判断当前环境是开发还是生产
const CopyWebpackPlugin = require('copy-webpack-plugin'); //将文件夹拷贝到构建目录下

const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //抽离 css

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); //量化打包文件大小
const smp = new SpeedMeasurePlugin();

const config = {
    mode: isDev ? 'development' : 'production',
    entry: {
        // 两个入口文件
        index:'./src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: '[name].[hash:6].js',
        publicPath: '' //通常是CDN地址
    },
    module:{ //模块
        rules:[ //规则
            {
                test: /\.jsx?$/,// 用于标识出应该被对应的 loader 进行转换的某个或某些文件。(正则)
                use: ['thread-loader','cache-loader','babel-loader'],// 表示进行转换时，应该使用哪个 loader
                exclude: /node_modules/ //排除 node_modules 目录
            },
            {
                test: /\.(le|c)ss$/,
                use: [
                    {
                        loader:MiniCssExtractPlugin.loader, //替换之前的 style-loader
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        }
                    },
                    
                    'css-loader', 
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')()
                                ]
                            }
                        }
                    },
                    'less-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            esModule: false,
                            name: '[name]_[hash:6].[ext]',
                            outputPath:'assets'
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins:[//数组 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template:'./public/index.html',
            filename: 'index.html' //打包后的文件名
        }),
        new CopyWebpackPlugin([
            {
                from: 'public/js/*.js',
                to: path.resolve(__dirname, 'dist', 'js'),
                flatten: true,
            },
            //还可以继续配置其它要拷贝的文件
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
            //个人习惯将css文件放在单独目录下
            //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath 
        })
    ],
    devServer: {
        port: '8080', //默认是8080
        quiet: false, //默认不启用 , true->无视一切内容不打印在控制台(包括错误警告、等)
        inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用。当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的
        clientLogLevel: "silent", //日志等级
        compress: true, //是否启用 gzip 压缩
        hot: true //热更新
    },
    devtool: 'cheap-module-eval-source-map', //开发环境下使用
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
}

module.exports = smp.wrap(config);