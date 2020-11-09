// miniprogram/pages/aboutPage/manageIdentify/manageIdentify.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    update: false,
    password: null,
    identity: 0,
    notice: "",
    msgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (app.globalData.identity <= 1) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      wx.navigateBack({
        delta: 1,
      })
    }
    this.setData({
      identity: app.globalData.identity
    })
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "manageIdentify"
      }
    }).catch(e => {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: "网络错误",
        icon: "none"
      })
    })
    if (result.code == 0) {
      const {notice} = result
      var msgList = []
      for (let i = 0; i*13 < notice.length; i++) {
        msgList[i] = notice.substr(13*i, 13)
      }
      this.setData({
        isLoad: true,
        password: result.password,
        update: result.update,
        notice,
        msgList
      })
    } else if (result.code == 1) {
      wx.showToast({
        title: '还未初始化',
        icon: "none"
      })
      this.setData({
        isLoad: true
      })

    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
      this.setData({
        isLoad: true
      })
    }
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

  },
  setNotice: async function(e) {
    if (this.data.identity <= 2 || this.data.identity == 5) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "setNotice",
        notice: this.data.notice
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    wx.hideLoading()
    if (result.code == 0) {
      wx.showToast({
        title: '提交成功',
        icon: "success"
      })
      this.hideModal()
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
    }
  },

  inputNotice: function(e) {
    var notice = e.detail.value
    var msgList = []
    for (let i = 0; i*13 < notice.length; i++) {
      msgList[i] = notice.substr(13*i, 13)
    }
    this.setData({
      notice, msgList
    })
  },
  showModal: function(e) {
    if (this.data.identity <= 2 || this.data.identity == 5) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      return
    }
    this.setData({
      modalName: "notice"
    })
  },
  hideModal: function(e) {
    this.setData({
      modalName: null
    })
  },
})