'use strict'
const puppeteer = require('puppeteer')
const Config = require('./config')
const devices = require('puppeteer/DeviceDescriptors')
// const iPhone6 = devices['iPhone 6']

;(async() => {

const browser = await puppeteer.launch({
  //设置超时时间
  timeout: 15000,
  //如果是访问https页面 此属性会忽略https错误
  ignoreHTTPSErrors: true,
  // 打开开发者工具, 当此值为true时, headless总为false
  devtools: false,
  // 关闭headless模式, 会打开浏览器
  headless: false
})
const page = await browser.newPage()

// 模拟 iPhone6
// await page.emulate(iPhone6)

await page.goto(Config.testUrl)

// 获取页面标题
let title = await page.title()
console.log('页面标题为:' + title)

// 获取指定dom内容
const SELECTOR_PRODUCT_NUM= '#setf'
const productNum = await page.$eval(SELECTOR_PRODUCT_NUM, el =>{
  return el.innerText
})
console.log('获取指定dom内容:' + productNum)

// 循环数据
const SELECTOR_PRODUCT_INFO= '#lh a'
const productInfo = await page.$$eval(SELECTOR_PRODUCT_INFO, el =>{
  return el.map(v => {
    const name = v.innerText
    return {
      name
    }
  })
})
console.log('循环数据1为:' + productInfo[0].name)

// 从某个dom下根据选择器获取dom
const dom1 = await page.evaluate(()=>{
  const SELECTOR_PRODUCT_dom1= '#cp'
  let el = document.querySelectorAll(SELECTOR_PRODUCT_dom1)[0]
  return el.querySelector('#jgwab').innerText
})
console.log('#cp > #jgwab的内容为:' + dom1)

await page.screenshot({
  path: 'screenshot/demo.png'
})

// await browser.close()

})()