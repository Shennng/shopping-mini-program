// pages/order/order.js
const qcloud = require("../../vendor/wafer2-client-sdk/index.js")
const config = require("../../config.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    authType: app.data.authType,
    orderList: [], // 订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getOrder() {
    wx.showLoading({
      title: '正在刷新...',
    })
    qcloud.request({
      url: config.service.orderUrl,
      login: true,
      success: res => {
        wx.hideLoading()
        let data = res.data

        if (!data.code) {
          this.setData({
            orderList: data.data
          })
        } else {
          wx.showToast({
            icon: "none",
            title: '刷新失败',
          })
        }
      },
      fail: res=> {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: '刷新失败',
        })
      }
    })
  },
  onTapLogin() {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo,
          authType: app.data.authType
        })
        this.getOrder()
      },
      error: () => {
        this.setData({
          authType: app.data.authType
        })
      }
    })
  },
  onTapToEditComment(event) {
    let data = event.currentTarget.dataset
    let product_id = data.product_id
    let order_id = data.order_id
    let name = data.name
    let price = data.price
    let image = data.image

    wx.navigateTo({
      url: `../comment/comment?id=${product_id}&image=${image}&price=${price}&name=${name}&isCommentEdit=true&order_id=${order_id}`
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
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          authType: app.data.authType
        })
        this.getOrder()
      }
    })
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