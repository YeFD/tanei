// miniprogram/pages/aboutPage/manageIdentify/manageIdentify.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    update: false,
    password: null,
    identity: 0
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
      this.setData({
        isLoad: true,
        password: result.password,
        update: result.update
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

  }
})