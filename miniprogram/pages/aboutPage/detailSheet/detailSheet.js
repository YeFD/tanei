const app = getApp()
Page({
  data: {
    identity: 0,
    sheet: null,
    create: null,
    cancel: null,
    receive: null,
    complete: null,
    scoreStar: [
      {
        score: 1,
        color: "grey",
        msg: "非常不满意"
      },
      {
        score: 2,
        color: "gray",
        msg: "不满意"
      },
      {
        score: 3,
        color: "yellow",
        msg: "一般"
      },
      {
        score: 4,
        color: "orange",
        msg: "满意"
      },
      {
        score: 5,
        color: "orange",
        msg: "非常满意"
      }
    ],
  },
  onLoad: async function (options) {
    this.setData({
      identity: app.globalData.identity
    })
    var sheetId = options.sheetId
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "getDetailSheet",
        sheetId
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
    this.setData({
      isLoad: true
    })
    if (result.code === 0) {
      var create = null
      if (!!result.sheet.createdTime) {
        let temp = new Date(new Date(result.sheet.createdTime).getTime() + 8*60*60*1000).toISOString().split("T")
        create = {
          year: temp[0].slice(0, 4),
          date: temp[0].slice(5),
          time: temp[1].split(".")[0]
        }
      }
      var receive = null
      if (!!result.sheet.receiveTime) {
        let temp = new Date(new Date(result.sheet.receiveTime).getTime() + 8*60*60*1000).toISOString().split("T")
        receive = {
          year: temp[0].slice(0, 4),
          date: temp[0].slice(5),
          time: temp[1].split(".")[0]
        }
      }
      var complete = null
      if (!!result.sheet.completeTime) {
        let temp = new Date(new Date(result.sheet.completeTime).getTime() + 8*60*60*1000).toISOString().split("T")
        complete = {
          year: temp[0].slice(0, 4),
          date: temp[0].slice(5),
          time: temp[1].split(".")[0]
        }
      }
      var cancel = null
      if (!!result.sheet.cancelTime) {
        let temp = new Date(new Date(result.sheet.cancelTime).getTime() + 8*60*60*1000).toISOString().split("T")
        cancel = {
          year: temp[0].slice(0, 4),
          date: temp[0].slice(5),
          time: temp[1].split(".")[0]
        }
      }
      var feedback = null
      if (!!result.sheet.feedbackTime) {
        let temp = new Date(new Date(result.sheet.feedbackTime).getTime() + 8*60*60*1000).toISOString().split("T")
        feedback = {
          year: temp[0].slice(0, 4),
          date: temp[0].slice(5),
          time: temp[1].split(".")[0]
        }
      }
      var summary = null
      if (!!result.sheet.summaryTime) {
        let temp = new Date(new Date(result.sheet.summaryTime).getTime() + 8*60*60*1000).toISOString().split("T")
        summary = {
          year: temp[0].slice(0, 4),
          date: temp[0].slice(5),
          time: temp[1].split(".")[0]
        }
      }
      this.setData({
        sheet: result.sheet,
        create, receive, complete, cancel, feedback, summary
      })
    } else {
      wx.showToast({
        title: "获取失败",
        icon: "none"
      })
    }
  },
  copyData(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.data,
      success: res => {
        wx.showToast({
          title: '已复制',
        })
      }
    })
  },

  tapCancel: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "cancelByAdmin",
        repairmanId: this.data.sheet.repairmanId,
        _id: this.data.sheet._id
      }
    }).catch(e => {
      wx.showToast({
        title: "网络错误",
        icon: "none"
      })
      return
    })
    wx.hideLoading()
    if (result.code === 0) {
      wx.showToast({
        title: '取消成功',
        icon: "success"
      })
      const {result} = await wx.cloud.callFunction({
        name: "repairSheetHelper",
        data: {
          action: "getDetailSheet",
          sheetId: this.data.sheet._id
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
        var cancel = null
        if (!!result.sheet.cancelTime) {
          let temp = new Date(new Date(result.sheet.cancelTime).getTime() + 8*60*60*1000).toISOString().split("T")
          cancel = {
            year: temp[0].slice(0, 4),
            date: temp[0].slice(5),
            time: temp[1].split(".")[0]
          }
        }
        this.setData({
          sheet: result.sheet,
          cancel
        })
      } else {
        wx.showToast({
          title: "获取失败",
          icon: "none"
        })
      }
    } else {
      console.log(result)
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }
  },
})