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
      var adminStatistics2 = []
      for (let i = 0; i < result2.adminStatistics.length; i++) {
        if (result2.adminStatistics[i].identity == '干事' && result2.adminStatistics[i].session == result2.curSession)
          adminStatistics2.push(result2.adminStatistics[i])
      }
      this.setData({
        isLoad: true,
        adminStatistics: result2.adminStatistics,
        adminStatistics2
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
})