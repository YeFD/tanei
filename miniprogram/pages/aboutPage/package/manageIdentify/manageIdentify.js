// miniprogram/pages/aboutPage/manageIdentify/manageIdentify.js
const app = getApp()
Page({
  data: {
    update: false,
    password: null,
    identity: 0,
    notice: "",
    msgList: []
  },
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
      var sessions = [result.curSession+1, result.curSession, result.curSession-1]
      this.setData({
        isLoad: true,
        password: result.password,
        update: result.update,
        notice,
        msgList,
        curSession: result.curSession,
        sessions
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
    const {target} = e.currentTarget.dataset
    if (this.data.identity <= 2) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      return
    }
    this.setData({
      modalName: target
    })
  },
  hideModal: function(e) {
    this.setData({
      modalName: null
    })
  },
  sessionChange: function(e) {
    this.setData({
      curSession: e.detail.value
    })
  },
  
  setSession: async function(e) {
    if (this.data.identity <= 4 || this.data.identity == 5) {
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
        action: "setSession",
        session: this.data.curSession
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
        title: '修改成功',
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
})