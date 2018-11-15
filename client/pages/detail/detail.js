// pages/detail/detail.js
const config = require("../../config.js")
const qcloud = require("../../vendor/wafer2-client-sdk/index.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductDetail(options.id)
  },
  getProductDetail(id) {
    wx.showLoading({
      title: '商品详情加载中',
    })
    qcloud.request({
      url: config.service.productDetail + id,
      success: res => {
        wx.hideLoading()
        let product = res.data.data
        if (product) {
          this.setData({
            product: product
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: res => {
        wx.hideLoading()
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
        console.log("faild! detail")
      }
    })
  },
  onTapBuy() {
    wx.showLoading({
      title: '购买中...',
    })
    let product = Object.assign({
      count: 1
    }, {
      id: this.data.product.id
    })
    qcloud.request({
      url: config.service.orderUrl,
      login: true,
      method: "POST",
      data: {
        list: [product]
      },
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          wx.showToast({
            title: '购买成功',
          })
        } else {
          wx.showToast({
            icon: "none",
            title: '购买失败',
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: '购买失败',
        })
      }
    })
  },
  onTapAddToTrolley() {
    let product = {
      id: this.data.product.id
    }

    wx.showLoading({
      title: '加购中...',
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
            title: '加购成功',
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
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})