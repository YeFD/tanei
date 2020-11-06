// miniprogram/pages/aboutPage/discover/discover.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  tapRe: function(e) {
    console.log("tapRe")
    this.selectComponent("#custom").reBug()
    this.onLoad()
  },
  tapFixBug: function(e) {
    console.log(this.selectComponent("#custom").data)
    wx.getSystemInfo({
      success: e => {
        app.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          app.globalData.Custom = capsule;
          app.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          app.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    this.selectComponent("#custom").fixBug()
    wx.showToast({
      title: '如果刷新页面后仍未修复，请尝试重新进入小程序',
      icon: "none",
      duration: 3000
    })
  }
})