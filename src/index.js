// webpack 打包入口文件

//  导入样式文件
import './a.css';
import './b.less';
import showMsg from './build';
import $ from 'jquery'
// import { mul } from './test'
import say from 'cpns/my'

//  import动态导入(配合webpack中的optimization配置):能将某个文件单独打包
// import(/* webpackChunkName:'testaa'*/'./test').then(({ mul, count }) => {
//   console.log(mul(3, 5))
// }).catch(() => {
//   console.log('文件导入失败~')
// })
// const { mul } = () => import('./test')

say()

function add(x, y) {
  // eslint-disable-next-line
  console.log(x + y + 4);
}

const sayHello = () => {
  // eslint-disable-next-line
  console.log('hello11');
};

add(3, 5);

//  exlint-disable-next-line
// console.log(mul(3, 5))

// eslint-disable-next-line
console.log($)

sayHello();

//  我们可以对入口文件的其他文件使用  HMR功能
//  此方法会监听build.js文件的变化，
//  一旦发生改变就会执行我们提供的回调函数，
//  就会执行我们提供的回调函数
//  其他模块不会重新打包构建
if (module.hot) {
  module.hot.accept('./build.js', () => {
    showMsg();
    //  eslint-disable-next-line
    console.log('我是热更新时执行的回调函数');
  });
}

const arr1 = [1, 2, 3, 4];
const zh = arr1.reduce((sum, num) => {
  sum += num;
  return sum;
}, 1);
console.log(`数组总和是:${zh}`);

document.getElementById('btn').onclick = function () {
  //  正常加载：可以认为是平行加载（同一时间加载多个文件）
  //  懒加载~ ：用到该文件的时候才会加载
  //  预加载 webpackPrefetch:true ：在使用该文件之间就把文件导入内存中（在其他资源加载完毕的时候，浏览器空闲的时候加载该资源文件）
  import(/* webpackChunkName:"lazyloadtest",webpackPrefetch:true  */'./test').then(({ mul }) => mul(3, 7))
}
console.log('index文件被加载了')

//  配置serviceworker
//  1、注册serviceworker
//  2、处理兼容性问题

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(() => {
        console.log('serviceworker注册成功')
      }).catch(() => {
        console.log('serviceworker注册失败')
      })
  })
}