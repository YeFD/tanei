// miniprogram/pages/aboutPage/manageMember/manageMember.js
const app = getApp()
Page({
  data: {
    tabIndex: 0,
    tabArray: ["干事", "管理层", "SA"],
    move: "",
    identity: 0,
    adminArray2: null,
    adminArray34: null,
    adminArray5: null,
    curIndex: null,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    sessions: [],
  },

  onLoad: async function (options) {
    this.setData({
      identity: app.globalData.identity
    })
    var {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "getMember"
      }
    }).catch(e => {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    })
    this.setData({
      isLoad: true
    })
    if (result.code === 0) {
      this.setData({
        adminArray2: result.adminArray2,
        adminArray34: result.adminArray34,
        adminArray5: result.adminArray5,
        sessions: result.sessions,
        curSession: result.sessions[0]
      })
    } else {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    }
  },
  tabSelect: function(e) {
    this.setData({
      move: null,
      listTouchDirection: null,
      tabIndex: e.currentTarget.dataset.id
    })
  },
  listTouchStart(e) {
    //开始
    if (this.data.tabIndex == 0) {
      if (this.data.identity < 3 || this.data.identity == 5) return
    }
    if (this.data.tabIndex == 1) {
      return
    }
    this.setData({
      listTouchStart: e.touches[0].pageX
    })
  },
  listTouchMove(e) {
    if (this.data.tabIndex == 0) {
      if (this.data.identity < 3 || this.data.identity == 5) return
    }
    if (this.data.tabIndex == 1) {
      return
    }
    this.setData({
      listTouchDirection: e.touches[0].pageX - this.data.listTouchStart > 0 ? 'right' :'left'
    })
  },
  listTouchEnd(e) {
    if (this.data.tabIndex == 0) {
      if (this.data.identity < 3 || this.data.identity == 5) return
    }
    if (this.data.tabIndex == 1) {
      return
    }
    if (this.data.listTouchDirection == 'left') {
      this.setData({
        move: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        move: null
      })
    }
    this.setData({
      listTouchDirection: null
    })
  },
  tapOffline: async function(e) {
    if (app.globalData.identity <= 2 || app.globalData.identity == 5) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {index} = e.currentTarget.dataset
    // var adminArray2 = this.data.adminArray2
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "offline",
        adminId: this.data.adminArray2[index]._id,
        name: app.globalData.adminInfo.name,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        adminOpenId: this.data.adminArray2[index].openId,
        adminName: this.data.adminArray2[index].name
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    })
    if (result.code === 0) {
      wx.showToast({
        title: '下线成功',
        icon: "success"
      })
      // adminArray2[index].online = false
      var adminArray2Online = "adminArray2[" + index + "]online"
      this.setData({
        [adminArray2Online]: false
      })
    } else {
      wx.showToast({
        title: '操作失败',
        icon: "none"
      })
    }
  },
  tapOnline: async function(e) {
    if (app.globalData.identity <= 2 || app.globalData.identity == 5) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {index} = e.currentTarget.dataset
    // var adminArray2 = this.data.adminArray2
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "online",
        adminId: this.data.adminArray2[index]._id,
        name: app.globalData.adminInfo.name,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        adminOpenId: this.data.adminArray2[index].openId,
        adminName: this.data.adminArray2[index].name
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    })
    if (result.code === 0) {
      wx.showToast({
        title: '上线成功',
        icon: "success"
      })
      // adminArray2[index].online = true
      var adminArray2Online = "adminArray2[" + index + "]online"
      this.setData({
        [adminArray2Online]: true
      })
    } else {
      wx.showToast({
        title: '操作失败',
        icon: "none"
      })
    }
  },
  showModal: function(e) {
    const {index, target} = e.currentTarget.dataset
    if (target === 'setting') {
      this.setData({
        curIndex: index,
        modalName: target
      })
      return
    }
    if (app.globalData.identity <= 3 || app.globalData.identity == 5) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      return
    }
    // console.log(e.currentTarget.dataset)
    if (app.globalData.identity != 6 && this.data.tabIndex == 1) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      return
    }
    this.setData({
      curIndex: index,
      modalName: target
    })
  },
  hideModal: function(e) {
    this.setData({
      modalName: null
    })
  },
  tapSetting: function(e) {
    console.log("test")
  },
  BackPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  sessionChange: function(e) {
    this.hideModal()
    this.setData({
      curSession: e.detail.value
    })
  }
})