// pages/comment/comment.js
const config = require("../../config.js")
const qcloud = require("../../vendor/wafer2-client-sdk/index.js")
const _ = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    comments: [],
    commentValue: "",
    tempImages: [],
    tempImages0: [],
    tempImages1: [],
    tempImages2: [],
    isCommentEdit: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      product: options
    })

    if (options.isCommentEdit) {
      this.setData({
        isCommentEdit: true
      })
    }

    if (!this.data.isCommentEdit) {
      this.getComments()
    }
  },
  getComments() {
    let product_id = +this.data.product.id

    qcloud.request({
      url: config.service.commentUrl,
      data: {
        product_id: product_id
      },
      success: res => {
        let data = res.data

        if (!data.code) {
          this.setData({
            comments: data.data.map(item => {
              let itemDate = new Date(item.create_time)
              item.create_time = _.formatTime(itemDate).substr(0,10)

              let imageUrls = item.images
              if (item.images) {
                let allImages = imageUrls.split(";;")
                item.images0 = allImages.length <= 3 ? allImages : allImages.slice(0, 3)
                item.images1 = allImages.length > 3 ? allImages.slice(3, 6) : []
                item.images2 = allImages.length > 6 ? allImages.slice(6, 9) : []
                console.log("item.images")
                console.log(allImages)
              }

              return item
            })
          })
        }
      },
      fail: res => {

      }
    })
  },
  onInput(event) {
    let commentValue = event.detail.value

    this.setData({
      commentValue
    })
  },
  chooseImage() {
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        let tempImages = this.data.tempImages
        let nowImages = tempImages.concat(tempFilePaths)
        console.log(nowImages)
        this.setData({
          tempImages: nowImages,
          tempImages0: nowImages.length <= 3 ? nowImages : nowImages.slice(0, 3),
          tempImages1: nowImages.length > 3 ? nowImages.slice(3, 6) : [],
          tempImages2: nowImages.length > 6 ? nowImages.slice(6, 9) : []
        })
      }
    })
  },
  previewImage(event) {
    let data = event.currentTarget.dataset
    let currenturl = data.url
    let commentIndex = data.index

    wx.previewImage({
        urls: isNaN(commentIndex) ? this.data.tempImages : this.data.comments[commentIndex].images.split(";;") ,
      current: currenturl,
    })
  },
  uploadImages(imageUrls, callback) {
    let commentImages = []

    console.log("imageUrls")
    console.log(imageUrls)
    
    let length = imageUrls.length
    for(let i = 0; i < length; i++) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: imageUrls[i],
        name: 'file',
        success: res => {
          console.log(res)
          let data = JSON.parse(res.data)
          length--

          if (!data.code) {
            commentImages.push(data.data.imgUrl)
          }

          if (length <= 0) {
            callback && callback(commentImages)
          }
        },
        fail: res => {
          length--
        }
      })
    }
  },
  onTapCommit() {
    let imageUrls = this.data.tempImages
    let commentValue = this.data.commentValue

    if (!commentValue) return

    if (imageUrls.length) {
      this.uploadImages(imageUrls, commentImages => {
        this.commit(commentImages)
      })
    } else {
      this.commit()
    }
  },
  commit(commentImages) {
    wx.showLoading({
      title: '评论中...',
    })

    qcloud.request({
      url: config.service.commentUrl,
      login: true,
      method: "PUT",
      data: {
        content: this.data.commentValue,
        product_id: this.data.product.id,
        images: commentImages || []
      },
      success: res => {
        wx.hideLoading()
        let data = res.data

        if (!data.code) {
          this.getComments()
          this.deleteOrder()
          this.setData({
            isCommentEdit: false
          })
        }
      },
      fail: res => {
        wx.hideLoading()
      }
    })
  },
  deleteOrder() {
    let order_id = + this.data.product.order_id
    if (isNaN(order_id)) return

    qcloud.request({
      url: config.service.orderUrl + `/${order_id}`,
      login: true,
      method: "PUT",
      success: res => {
        let data = res.data

        if (!data.code) {
          wx.showModal({
            title: '成功',
            content: '评论成功，请查看~',
            showCancel: false
          })
        }
      },
      fail: res => {
        wx.showModal({
          title: 'FAILED',
          content: '评论失败',
          showCancel: false
        })
        console.log(res)
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