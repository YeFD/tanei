Page({
  data: {

  },
  onLoad: async function (options) {
    const {result} = await wx.cloud.callFunction({
      name: "statisticsHelper",
      data: {
        action: "getStatistics"
      }
    }).catch(e => {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    if (result.code === 0) {
      this.setData({
        isLoad: true,
        total: result.total,
        userNum: result.userNum
      })
    } else {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    }
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  copyData: function(e) {
    wx.setClipboardData({
      data: "i-am-xiaoji",
      success: res => {
        wx.showToast({
          title: '已复制微信号',
        })
      }
    })
  },
})