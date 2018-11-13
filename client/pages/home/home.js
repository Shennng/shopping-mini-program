// pages/home/home.js
const qcloud = require("../../vendor/wafer2-client-sdk/index.js")
const config = require("../../config.js")

Page({
  data: {
    productList: [], // 商品列表
  },
  onLoad(options) {
    this.getProductList()
  },
  getProductList() {
    wx.showLoading({
      title: '商品数据加载中',
    })
    qcloud.request({
      url: config.service.productListUrl,
      success: res => {
        wx.hideLoading()
        let productList = res.data.data
        if (!res.data.code) {
          this.setData({
            productList: productList
          })
        } else {
          wx.showToast({
            title: '商品数据加载失败',
          })
        }
        console.log(productList)
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '商品数据加载失败',
        })
        console.log("failed! home")
      }
    })
  }
})