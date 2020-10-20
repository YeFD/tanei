// miniprogram/pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPage: "home",
    // refresh: true,
    userInfo: null,
    identity: 0,
    identityColor: ["gray", "gray", "blue", "pink", "red", "yellow", "mauve"],
    superAdminList: [
    ],
    adminInfo: null,
    list1: [
      {
        icon: "notice",
        color: "green",
        badge: 0,
        name: "消息",
        bindtap: "toMessageBox"
      },
      {
        icon: "form",
        color: "purple",
        badge: 0,
        name: "我的报修",
        bindtap: "toMyRepairSheet"
      }
    ],
    list2: [
      {
        icon: "profile",
        color: "pink",
        name: "认证信息",
        bindtap: "toMyIdentity"
      },
      {
        icon: "repair",
        color: "blue",
        name: "我的维修",
        bindtap: "toMyReceivedRepairSheet"
      },
      {
        icon: "list",
        color: "orange",
        name: "所有报单",
        bindtap: "toAllSheets"
      },
      {
        icon: "group",
        color: "red",
        name: "塔内成员",
        bindtap: "toManageMember"
      },
      {
        icon: "lock",
        color: "cyan",
        name: "认证管理",
        bindtap: "toManageIdentify"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await wx.cloud.callFunction({
      name: "usersHelper",
      data: {
        action: "login"
      }
    }).then(res => {
      if (res.result.code === 0) {
        console.log("login successfully", res.result)
        app.globalData.identity = res.result.identity
        app.globalData.userInfo = res.result.userInfo
        app.globalData.adminInfo = res.result.adminInfo
        app.globalData.msgNum = res.result.msgNum
        // app.globalData.adminArray = res.result.adminArray
        var list1 = [
          {
            icon: "notice",
            color: "olive",
            badge: app.globalData.msgNum,
            name: "消息",
            bindtap: "toMessageBox"
          },
          {
            icon: "form",
            color: "purple",
            badge: 0,
            name: "我的报修",
            bindtap: "toMyRepairSheet"
          }
        ]
        if (app.globalData.identity <= 1) {
          this.setData({
            list1,
            isLoad: true,
            identity: app.globalData.identity,
            userInfo: app.globalData.userInfo
          })
        } else {
          this.setData({
            list1,
            isLoad: true,
            identity: app.globalData.identity,
            userInfo: app.globalData.userInfo,
            adminInfo: app.globalData.adminInfo
          })
        }
      } else if (res.result.code === 1) {
        console.log("login", res.result)
      }
      console.log(app.globalData)
    }).catch(res => {
      console.log("login error", res)
      wx.showToast({
        title: '获取信息失败',
        icon: "none"
      })
      this.setData({
        isLoad: true
      })
    })
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
    console.log("onshow")
    var list1 = [
      {
        icon: "notice",
        color: "olive",
        badge: app.globalData.msgNum,
        name: "消息",
        bindtap: "toMessageBox"
      },
      {
        icon: "form",
        color: "purple",
        badge: 0,
        name: "我的报修",
        bindtap: "toMyRepairSheet"
      }
    ]
    if (app.globalData.identity <= 1) {
      this.setData({
        list1,
        identity: app.globalData.identity,
        userInfo: app.globalData.userInfo
      })
    } else {
      this.setData({
        list1,
        identity: app.globalData.identity,
        userInfo: app.globalData.userInfo,
        adminInfo: app.globalData.adminInfo
      })
    }
    // this.setData({
    //   refresh: false
    // })
    // this.setData({
    //   refresh: true
    // })
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
  navChange(e) {
    this.setData({
      curPage: e.currentTarget.dataset.cur
    })
  },
  getUserInfo: async function(e) {
    app.globalData.userInfo = e.detail.userInfo
    const {nickName, gender, avatarUrl} = e.detail.userInfo
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    if (app.globalData.identity >= 1) {
      //更新
      var identity = app.globalData.identity
      let adminId = null
      if (identity >= 2) {
        adminId = this.data.adminInfo._id
      }
      const {result} = await wx.cloud.callFunction({
        name: "usersHelper",
        data: {
          action: "updateUserInfo",
          nickName,
          gender,
          avatarUrl,
          adminId
        }
      }).catch(res => {
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
        return
      })
      if (result.code === 0) {
        wx.showToast({
          title: '更新成功',
          icon: "success"
        })
        this.setData({
          userInfo: e.detail.userInfo,
          identity: identity
        })
      } else {
        wx.showToast({
          title: '更新失败',
          icon: "none"
        })
      }
    } else {
      //注册
      const {result} = await wx.cloud.callFunction({
        name: "usersHelper",
        data: {
          action: "register",
          nickName,
          gender,
          avatarUrl
        }
      }).catch(res => {
        wx.showToast({
          title: '获取信息失败',
          icon: "none"
        })
        return
      })
      if (result.code == 0) {
        app.globalData.identity = 1
        wx.showToast({
          title: '获取成功',
          icon: "success"
        })
        this.setData({
          identity: app.globalData.identity,
          userInfo: app.globalData.userInfo
        })
      } else if (result.code == 3) {
        //管理员
        wx.showToast({
          title: '获取成功',
          icon: "success"
        })
        app.globalData.identity = result.identity
        app.globalData.userInfo = result.userInfo
        app.globalData.adminInfo = result.adminInfo
        app.globalData.msgNum = result.msgNum
        // app.globalData.adminArray = res.result.adminArray
        var list1 = [
          {
            icon: "notice",
            color: "olive",
            badge: app.globalData.msgNum,
            name: "消息",
            bindtap: "toMessageBox"
          },
          {
            icon: "form",
            color: "purple",
            badge: 0,
            name: "我的报修",
            bindtap: "toMyRepairSheet"
          }
        ]
        this.setData({
          list1,
          identity: app.globalData.identity,
          userInfo: app.globalData.userInfo,
          adminInfo: app.globalData.adminInfo
        })
      }
    }
  },
  // toUserInfo() {
  //   wx.navigateTo({
  //     url: '/pages/aboutPage/userInfo/userInfo',
  //   })
  // },
  toManageMember() {
    wx.navigateTo({
      url: '/pages/aboutPage/manageMember/manageMember',
    })
  },
  toMessageBox() {
    wx.navigateTo({
      url: '/pages/aboutPage/messageBox/messageBox',
    })
  },
  toIdentify() {
    console.log("identify page")
    if (this.data.identity !== 1) {
      wx.showToast({
        title: '已经存在认证',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: '/pages/aboutPage/identify/identify',
    })
  },
  toMyIdentity() {
    wx.navigateTo({
      url: '/pages/aboutPage/myIdentity/myIdentity',
    })
  },
  toMyReceivedRepairSheet() {
    wx.navigateTo({
      url: '/pages/aboutPage/myReceivedRepairSheet/myReceivedRepairSheet',
    })
  },
  toMyRepairSheet() {
    wx.navigateTo({
      url: '/pages/aboutPage/myRepairSheet/myRepairSheet',
    })
  },
  toAllSheets() {
    wx.navigateTo({
      url: '/pages/aboutPage/allSheets/allSheets',
    })
  },
  toManageIdentify() {
    wx.navigateTo({
      url: '/pages/aboutPage/manageIdentify/manageIdentify',
    })
  },
  toDiscover() {
    // wx.showToast({
    //   title: "暂未开放",
    //   icon: "none"
    // })
    wx.navigateTo({
      url: '/pages/aboutPage/discover/discover',
    })
  }
})