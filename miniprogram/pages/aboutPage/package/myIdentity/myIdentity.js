// miniprogram/pages/aboutPage/myIdentity/myIdentity.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adminInfo: null,
    password: null,
    nickName: null,
    modalName: null,
    revoke: null,
    identityColor: ["gray", "gray", "blue", "pink", "red", "yellow", "mauve"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "getIdentity"
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
    if (result.code == 0) {
      app.globalData.adminInfo.identity = result.adminInfo.identity
      app.globalData.identity = result.identity
      if (!!result.adminInfo.nickName) {
        app.globalData.adminInfo.nickName = result.adminInfo.nickName
        this.setData({
          isLoad: true,
          nickName: result.adminInfo.nickName,
          adminInfo: result.adminInfo,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          identity: result.identity,
        })
      } else {
        this.setData({
          isLoad: true,
          nickName: result.adminInfo.name,
          adminInfo: result.adminInfo,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          identity: result.identity,
        })
      }
    } else {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '请求错误',
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
  listTouchStart(e) {
    //开始
    this.setData({
      listTouchStart: e.touches[0].pageX
    })
  },
  listTouchMove(e) {
    this.setData({
      listTouchDirection: e.touches[0].pageX - this.data.listTouchStart > 0 ? 'right' :'left'
    })
  },
  listTouchEnd(e) {
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
  tapUpdate: async function(e) {
    if (this.data.password == "" || !this.data.password) {
      wx.showToast({
        title: '密钥不能为空',
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "updateIdentity",
        password: this.data.password,
        adminId: this.data.adminInfo._id
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
      this.setData({
        modalName: null,
        password: null
      })
      return
    })
    wx.hideLoading()
    if (result.code == 3) {
      wx.showToast({
        title: '暂未开启二次认证',
        icon: "none"
      })
    } else if (result.code == 0) {
      //更新成功
      wx.showToast({
        title: '更新认证成功',
        icon: "success"
      })
      // var adminInfo = this.data.adminInfo
      // adminInfo.identity = result.identity2
      var online
      if (result.identity == 2) {
        // adminInfo.online = true
        online = true
      } else if (result.identity == 3 || result.identity == 4) {
        // adminInfo.online = false
        online = false
      }
      this.setData({
        identity: result.identity,
        // adminInfo: adminInfo,
        "adminInfo.identity": result.identity2,
        "adminInfo.online": online
      })
      app.globalData.adminInfo.identity = result.identity2
      app.globalData.identity = result.identity
    } else if (result.code == 1) {
      wx.showToast({
        title: "没有认证信息",
        icon: "none"
      })
    } else if (result.code == 2) {
      wx.showToast({
        title: '密钥错误',
        icon: "none"
      })
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
    }
    this.setData({
      modalName: null,
      password: null
    })
  },
  tapOffline: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "offline",
        _id: this.data.adminInfo._id,
        name: this.data.adminInfo.name,
        avatarUrl: app.globalData.userInfo.avatarUrl
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        modalName: null
      })
      return
    })
    wx.hideLoading()
    if (result.code == 0) {
      wx.showToast({
        title: '申请成功',
        icon: "success"
      })
    } else if (result.code == 1) {
      wx.showToast({
        title: '已存在申请，长按可撤销',
        icon: "none"
      })
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
    }
    this.setData({
      modalName: null
    })
  },
  tapOnline: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "online",
        _id: this.data.adminInfo._id,
        name: this.data.adminInfo.name,
        avatarUrl: app.globalData.userInfo.avatarUrl
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        modalName: null
      })
      return
    })
    wx.hideLoading()
    if (result.code == 0) {
      wx.showToast({
        title: '申请成功',
        icon: "success"
      })
    } else if (result.code == 1) {
      wx.showToast({
        title: '已存在申请，长按可撤销',
        icon: "none"
      })
    } else {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    }
    this.setData({
      modalName: null
    })
  },
  showModal: function(e) {
    console.log(e.currentTarget.dataset)
    var nickName = null
    if (!!this.data.adminInfo.nickName) {
      nickName = this.data.adminInfo.nickName
    }
    this.setData({
      nickName: nickName,
      modalName: e.currentTarget.dataset.target
    })
  },
  showRevoke: function(e) {
    this.setData({
      modalName: "revoke",
      revoke: e.currentTarget.dataset.target
    })
  },
  hideModal: function(e) {
    this.setData({
      nickName: null,
      password: null,
      modalName: null
    })
  },
  inputPassword: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  inputNickName: function(e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  tapNickName: async function(e) {
    if (this.data.nickName == "" || !this.data.nickName) {
      wx.showToast({
        title: '昵称不能为空',
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    if (this.data.identity == 2) {
      const {result} = await wx.cloud.callFunction({
        name: "messageHelper",
        data: {
          action: "nickName",
          _id: this.data.adminInfo._id,
          name: this.data.adminInfo.name,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          nickName: this.data.nickName
        }
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
        this.setData({
          nickName: null,
          modalName: null
        })
        return
      })
      wx.hideLoading()
      if (result.code == 0) {
        wx.showToast({
          title: '提交成功',
          icon: "success"
        })
      } else if (result.code == 1) {
        wx.showToast({
          title: '已经存在申请，长按可撤销',
          icon: "none"
        })
      } else {
        wx.showToast({
          title: '请求错误',
          icon: "none"
        })
      }
      
    } else {
      //直接修改
      var nickName = this.data.nickName
      if (nickName == this.data.adminInfo.name) {
        nickName = null
      }
      const {result} = await wx.cloud.callFunction({
        name: "adminHelper",
        data: {
          action: "updateNickName",
          nickName: nickName,
          adminId: this.data.adminInfo._id
        }
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
        this.setData({
          nickName: null,
          modalName: null
        })
        return
      })
      wx.hideLoading()
      if (result.code == 0) {
        console.log(nickName)

        this.setData({
          "adminInfo.nickName": nickName
        })
        app.globalData.adminInfo.nickName = nickName
        wx.showToast({
          title: '修改成功',
          icon: "success"
        })
      } else {
        wx.showToast({
          title: '请求错误',
          icon: "none"
        })
      }
    }
    this.setData({
      nickName: null,
      modalName: null
    })
  },
  tapEmail: function(e) {
    wx.showToast({
      title: "权限不足",
      icon: "none"
    })
  },
  tapWechat: function(e) {
    wx.showToast({
      title: "权限不足",
      icon: "none"
    })
  },
  tapOffline2: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "offline",
        adminId: this.data.adminInfo._id
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    if (result.code == 0) {
      wx.showToast({
        title: '下线成功',
        icon: "success"
      })
      this.setData({
        "adminInfo.online": false
      })
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
    }
  },
  tapOnline2: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "online",
        adminId: this.data.adminInfo._id
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    if (result.code == 0) {
      wx.showToast({
        title: '上线成功',
        icon: "success"
      })
      this.setData({
        "adminInfo.online": true
      })
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
    }
  },
  tapRevoke: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var action
    if (this.data.revoke == "nickName") {
      action = "revokeNickName"
    } else if (this.data.revoke == 'offline') {
      action = "revokeOffline"
    } else if (this.data.revoke == 'online') {
      action = "revokeOnline"
    }
    console.log(action)
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: action,
        name: this.data.adminInfo.name
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    if (result.code == 0) {
      wx.showToast({
        title: '撤销成功',
        icon: "success"
      })
    } else if (result.code == 1) {
      wx.showToast({
        title: '暂无申请',
        icon: "none"
      })
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
    }
  }
})