// miniprogram/pages/aboutPage/manageMember/manageMember.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    tabArray: ["干事", "管理层", "老人"],
    move: "",
    identity: 0,
    adminArray2: null,
    adminArray34: null,
    adminArray5: null,
    curIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      identity: app.globalData.identity
    })
    const {result} = await wx.cloud.callFunction({
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
        adminArray5: result.adminArray5
      })
    } else {
      wx.showToast({
        title: '网络错误',
        icon: "none"
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
      if (this.data.identity < 4 || this.data.identity == 5) return
    }
    console.log("listTouchStart", this.data)
    this.setData({
      listTouchStart: e.touches[0].pageX
    })
  },
  listTouchMove(e) {
    if (this.data.tabIndex == 0) {
      if (this.data.identity < 3 || this.data.identity == 5) return
    }
    if (this.data.tabIndex == 1) {
      if (this.data.identity < 4 || this.data.identity == 5) return
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
      if (this.data.identity < 4 || this.data.identity == 5) return
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
    const {index, target} = e.currentTarget.dataset
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
  tapUpdate: async function(e) {
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
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.tabIndex == 0) {
      const {result} = await wx.cloud.callFunction({
        name: "adminHelper",
        data: {
          action: "changeIdentity",
          adminId: this.data.adminArray2[this.data.curIndex]._id,
          name: app.globalData.adminInfo.name,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          adminOpenId: this.data.adminArray2[this.data.curIndex].openId,
          adminName: this.data.adminArray2[this.data.curIndex].name
        }
      }).catch(e => {
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
      })
      if (result.code === 0) {
        wx.showToast({
          title: "更改成功",
          icon: "success"
        })
        var adminArray2 = this.data.adminArray2
        var adminArray5 = this.data.adminArray5
        var adminInfo = adminArray2.splice(this.data.curIndex, 1)
        adminArray5.push(adminInfo[0])
        console.log(adminInfo[0], adminArray5, this.data.curIndex)
        this.setData({
          adminArray2,
          adminArray5
        })
      } else {
        wx.showToast({
          title: '请求错误',
          icon: "none"
        })
      }
    } else if (this.data.tabIndex == 1) {
      const {result} = await wx.cloud.callFunction({
        name: "adminHelper",
        data: {
          action: "changeIdentity",
          adminId: this.data.adminArray34[this.data.curIndex]._id,
          name: app.globalData.adminInfo.name,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          adminOpenId: this.data.adminArray34[this.data.curIndex].openId,
          adminName: this.data.adminArray34[this.data.curIndex].name
        }
      }).catch(e => {
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
      })
      if (result.code === 0) {
        wx.showToast({
          title: "更改成功",
          icon: "success"
        })
        var adminArray34 = this.data.adminArray34
        var adminArray5 = this.data.adminArray5
        var adminInfo = adminArray34.splice(this.data.curIndex, 1)
        adminArray5.push(adminInfo[0])
        console.log(adminInfo[0], adminArray5)
        this.setData({
          adminArray34,
          adminArray5
        })
      } else {
        wx.showToast({
          title: '请求错误',
          icon: "none"
        })
      }
    }
  }
})