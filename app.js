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

await page.goto(Config.url)

console.log('等待中...')
await page.waitFor(2000)

// 获取页面标题
let title = await page.title()
console.log('页面标题为:' + title)

// 获取商品总数
const SELECTOR_PRODUCT_NUM= '.search-result span'
// const SELECTOR_PRODUCT_NUM= '#s_hd_links'
const productNum = await page.$eval(SELECTOR_PRODUCT_NUM, el =>{
  return el.innerText
})
console.log('商品总数为:' + productNum)

// 获取商品信息
let productInfo = await page.evaluate(() => {
  const SELECTOR_PRODUCT_INFO= 'dl.item'
  let el = document.querySelectorAll(SELECTOR_PRODUCT_INFO)
  el = Array.prototype.slice.call(el)
  return el.map(v => {
    const name = v.querySelector('.item-name').innerText
    const price = v.querySelector('.c-price').innerText
    const saleNum = v.querySelector('.sale-num').innerText
    return {
      name,
      price,
      saleNum
    }
  })
})
console.log('商品信息为:' + productInfo)

// 下一页
let hasNext = true
while(hasNext){
  const nextBtn = await page.$('a.next')
  if(!nextBtn) {
    hasNext = false
    return false
  }
  await nextBtn.click()
  await page.waitFor(5000)
  // 获取商品信息
  let productInfoNext = await page.evaluate(() => {
    const SELECTOR_PRODUCT_INFO= 'dl.item'
    let el = document.querySelectorAll(SELECTOR_PRODUCT_INFO)
    el = Array.prototype.slice.call(el)
    return el.map(v => {
      const name = v.querySelector('.item-name').innerText
      const price = v.querySelector('.c-price').innerText
      const saleNum = v.querySelector('.sale-num').innerText
      return {
        name,
        price,
        saleNum
      }
    })
  })
  productInfo.push(productInfoNext)
  await page.screenshot({
    path: 'screenshot/demo_'+ new Date().getTime() +'.png',
    fullPage: true
  })
  console.log('总商品信息为:' + productInfo)
}
await page.screenshot({
  path: 'screenshot/demo.png',
  fullPage: true
})

// await browser.close()

})()