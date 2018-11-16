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
  onTapTrolleyEdit() {
    let isTrolleyEdit = this.data.isTrolleyEdit

    if (isTrolleyEdit) {
      this.updateTrolley()
    } else {
      this.setData({
        isTrolleyEdit: !isTrolleyEdit
      })
    }
  },
  updateTrolley() {
    wx.showLoading({
      title: '提交中...',
    })

    let trolleyList = this.data.trolleyList

    qcloud.request({
      url: config.service.trolleyUrl,
      method: "POST",
      login: true,
      data: {
        list: trolleyList
      },
      success: res => {
        wx.hideLoading()
        let data = res.data

        if (!data.code) {
          wx.showToast({
            title: '提交成功',
          })
          this.setData({
            isTrolleyEdit: false
          })
          console.log(trolleyList)
        } else {
          wx.showToast({
            icon: "none",
            title: '提交失败',
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: '提交失败',
        })
      }
    })
  },
  onTapModifyCount(event) {
    let dataset = event.currentTarget.dataset
    let presentIndex = dataset.index
    let ModifyType = dataset.type
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    //这是一种引用传递（或者叫传址），任何对 product 的操作都会影响到 trolleyList[index]
    let product = trolleyList[presentIndex]
    

    if (product) {
      // 点击加号
      if (ModifyType == "add") {
        product.count++
      } else {
        // 点击减号
        if (product.count <= 1) {
          // 删去该购物车商品相关记录
          delete trolleyCheckMap[product.id]  //删除后，会留下undefined
          trolleyList.splice(+ presentIndex, 1)  //删除后，不会留下undefined
        } else {
          product.count--
        }
      }
    }

    //调整总价
    let trolleyAccount = this.getTrolleyAccount(trolleyList, this.data.trolleyCheckMap)

    this.setData({
      trolleyList,
      trolleyAccount
    })
  },
  getTrolleyAccount(trolleyList, trolleyCheckMap) {
    let trolleyAccount = 0

    trolleyList.forEach(item => {
      let itemAccount = item.price * item.count
      trolleyAccount = (trolleyCheckMap[item.id] ? trolleyAccount + itemAccount : trolleyAccount)
    })

    return trolleyAccount
  },
  onTapCheckSingle(event) {
    let checkId = event.currentTarget.dataset.id
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let numTotalProduct
    let numCheckedProduct = 0

    // 单个商品选中/取消
    trolleyCheckMap[checkId] = !trolleyCheckMap[checkId]

    // 监测全选按钮是否应点亮
    numTotalProduct = trolleyList.length
    trolleyCheckMap.forEach(checked => {
      numCheckedProduct = checked ? numCheckedProduct + 1 : numCheckedProduct
    })

    isTrolleyTotalCheck = (numTotalProduct === numCheckedProduct) ? true : false

    let trolleyAccount = this.getTrolleyAccount(trolleyList, trolleyCheckMap)

    this.setData({
      trolleyCheckMap,
      isTrolleyTotalCheck,
      trolleyAccount
    })
  },
  onTapCheckTotal() {
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList

    // 全选按钮状态改变
    isTrolleyTotalCheck = !isTrolleyTotalCheck

    // 所有购物车商品跟随全选按钮发生改变
    trolleyList.forEach(item => {
      trolleyCheckMap[item.id] = isTrolleyTotalCheck
    })

    let trolleyAccount = this.getTrolleyAccount(trolleyList, trolleyCheckMap)

    this.setData({
      trolleyCheckMap,
      isTrolleyTotalCheck,
      trolleyAccount
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
          this.setData({
            trolleyList
          })
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
  onTapPay() {
    if (!this.data.trolleyAccount) return
    
    wx.showLoading({
      title: '结算中...',
    })

    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let payList = trolleyList.filter(product => {
      return !!trolleyCheckMap[product.id]
    })

    //for (let i = 0; i < trolleyList.length; i++) {
    //  if (trolleyCheckMap[trolleyList[i].id]) {
    //    let item = Object.assign({
    //      count: 1
    //    }, trolleyList[i])
    //    payList.push(item)
    //  }
    //}

    qcloud.request({
      url: config.service.orderUrl,
      login: true,
      method: "POST",
      data: {
        list: payList
      },
      success: res => {
        wx.hideLoading()
        let data = res.data

        if (!data.code) {
          wx.showToast({
            title: '结算完成',
          })
          this.setData({
            trolleyCheckMap: [],
            trolleyAccount: 0,
            isTrolleyTotalCheck: false
          })
          this.getTrolley()
        } else {
          wx.showToast({
            icon: "none",
            title: '结算失败',
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: '结算失败',
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