const app = getApp()
Page({
  data: {
    curPage: "home",
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
        badge: 0,
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
        name: "管理",
        bindtap: "toManageIdentify"
      }
    ]
  },
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
          var list2 = [
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
              badge: app.globalData.adminInfo.ingNum,
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
              name: "管理",
              bindtap: "toManageIdentify"
            }
          ]
          this.setData({
            list1, list2,
            isLoad: true,
            identity: app.globalData.identity,
            userInfo: app.globalData.userInfo,
            adminInfo: app.globalData.adminInfo
          })
        }
      } else if (res.result.code === 1) {
        this.setData({
          isLoad: true
        })
        console.log("login", res.result)
      }
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
  onShow: function () {
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
      var list2 = [
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
          badge: app.globalData.adminInfo.ingNum,
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
          name: "管理",
          bindtap: "toManageIdentify"
        }
      ]
      this.setData({
        list1, list2,
        identity: app.globalData.identity,
        userInfo: app.globalData.userInfo,
        adminInfo: app.globalData.adminInfo
      })
    }
  },
  onShareAppMessage: function () {

  },
  navChange(e) {
    this.setData({
      curPage: e.currentTarget.dataset.cur
    })
  },
  getUserInfo: async function(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '授权失败',
        icon: "none"
      })
      return
    }
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
  toManageMember() {
    wx.navigateTo({
      url: '/pages/aboutPage/package/manageMember/manageMember',
    })
  },
  toMessageBox() {
    wx.navigateTo({
      url: '/pages/aboutPage/messageBox/messageBox',
    })
  },
  toIdentify() {
    if (this.data.identity !== 1) {
      wx.showToast({
        title: '已经存在认证',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: '/pages/aboutPage/package2/identify/identify',
    })
  },
  toMyIdentity() {
    wx.navigateTo({
      url: '/pages/aboutPage/package/myIdentity/myIdentity',
    })
  },
  toMyReceivedRepairSheet() {
    wx.navigateTo({
      url: '/pages/aboutPage/package/myReceivedRepairSheet/myReceivedRepairSheet',
    })
  },
  toMyRepairSheet() {
    wx.navigateTo({
      url: '/pages/aboutPage/myRepairSheet/myRepairSheet',
    })
  },
  toAllSheets() {
    wx.navigateTo({
      url: '/pages/aboutPage/package/allSheets/allSheets',
    })
  },
  toManageIdentify() {
    wx.navigateTo({
      url: '/pages/aboutPage/package/manageIdentify/manageIdentify',
    })
  },
  toDiscover() {
    wx.navigateTo({
      url: '/pages/aboutPage/package1/discover/discover',
    })
  }
})