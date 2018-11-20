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
    qcloud.request({
      url: config.service.productListUrl,
      success: res => {
        let productList = res.data.data
        if (!res.data.code) {
          this.setData({
            productList: productList
          })
        }
      },
      fail: res => {

      }
    })
  },
  onTapAddToTrolley(event) {
    let product = {
      id: + event.currentTarget.dataset.id
    }
    wx.showLoading({
      title: '加入购物车...',
    })
    qcloud.request({
      url: config.service.trolleyUrl,
      login: true,
      method: "PUT",
      data: product,
      success: res => {
        wx.hideLoading()
        let data = res.data

        if (!data.code) {
          wx.showToast({
            title: "加购成功!"
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请先登录',
            showCancel: false
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '请先登录',
          showCancel: false
        })
      }
    })
  }
})