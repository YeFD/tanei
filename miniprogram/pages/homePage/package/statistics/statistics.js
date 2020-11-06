// miniprogram/pages/homePage/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // wx.showToast({
    //   title: "暂未开放",
    //   icon: "none",
    //   success: (res) => {
    //     setTimeout(
    //       () => {
    //         wx.navigateBack({
    //           delta: 1,
    //         })
    //       }
    //     , 1500)
    //   }
    // })
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "getStatistics"
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        isLoad: true
      })
      return
    })
    if (result.code == 0) {
      const {ingNum, completedNum, totalNum, completed1, completed3, completed7} = result
      this.setData({
        ingNum, completedNum, totalNum, completed1, completed3, completed7
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
    const result_ = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "getAdminStatistics"
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        isLoad: true
      })
      return
    })
    const result2 = result_.result
    console.log(result2)
    if (result2.code == 0) {
      this.setData({
        isLoad: true,
        adminStatistics: result2.adminStatistics
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