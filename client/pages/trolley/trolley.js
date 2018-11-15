// pages/trolley/trolley.js
const app = getApp()
const qcloud = require("../../vendor/wafer2-client-sdk/index.js")
const config = require("../../config.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    authType: app.data.authType,
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onTapLogin() {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo,
          authType: app.data.authType
        })
        this.getTrolley()
      },
      error: () => {
        this.setData({
          authType: app.data.authType
        })
      }
    })
  },
  getTrolley() {
    wx.showLoading({
      title: '购物车数据加载中',
    })
    qcloud.request({
      url: config.service.trolleyUrl,
      login: true,
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          let trolleyList = data.data
          let trolleyCheckMap = []
          trolleyList.forEach(() => {
            trolleyCheckMap.push(undefined)
          })
          this.setData({
            trolleyList,
            trolleyCheckMap
          })
          console.log(trolleyCheckMap)
        } else {
          wx.showToast({
            icon: "none",
            title: '未成功获取数据',
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: '未成功获取数据',
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
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          authType: app.data.authType
        })
        this.getTrolley()
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