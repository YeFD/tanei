const app = getApp()
Page({
  data: {
    isRead: 0,
    switchArray: ["未读", "已读"],
    unreadArray: [],
    readArray: [],
    curReadArray: [],
    pageSize: 10,
    curPage: 1,
    pageArray: null,
    pageNum: 0
  },
  onLoad: async function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "getMessage"
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
      var pageArray = []
      for (let i = 1; i <= Math.ceil(result.total / 10); i++) {
        pageArray.push(i)
      }
      // console.log(pageArray)
      var unreadArray = result.unreadMessageArray
      var readArray = result.readMessageArray
      for (let i in unreadArray) {
        let sentTime = new Date(new Date(unreadArray[i].sentTime).getTime() + 8*60*60*1000).toISOString()
        let temp = sentTime.split("T")
        let time = temp[0] + " " + temp[1].split(".")[0]
        unreadArray[i].time = time
      }
      for (let i in readArray) {
        let sentTime = new Date(new Date(readArray[i].sentTime).getTime() + 8*60*60*1000).toISOString()
        let temp = sentTime.split("T")
        let time = temp[0] + " " + temp[1].split(".")[0]
        readArray[i].time = time
      }
      var curReadArray = readArray.slice(0, this.data.pageSize)
      this.setData({
        isLoad: true,
        pageArray: pageArray,
        unreadArray: unreadArray,
        readArray: readArray,
        curReadArray: curReadArray,
        pageNum: Math.ceil(result.total / 10)
      })
      app.globalData.msgNum = unreadArray.length
    } else {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        isLoad: true
      })
    }
  },
  tapRead: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // var unreadArray = this.data.unreadArray
    const {index} = e.currentTarget.dataset
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "read",
        messageId: this.data.unreadArray[index]._id
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    if (result.code == 0) {
      wx.showToast({
        title: '操作成功',
        icon: "success"
      })
      // unreadArray[index].read = true
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true
      })
      app.globalData.msgNum -= 1
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
    }
  },
  tapReceived: async function(e) {
    this.tapRead(e)
    wx.navigateTo({
      url: '/pages/aboutPage/package/myReceivedRepairSheet/myReceivedRepairSheet',
    })
  },
  tapFeedback: async function(e) {
    this.tapRead(e)
    wx.navigateTo({
      url: '/pages/aboutPage/myRepairSheet/myRepairSheet',
    })
  },
  tabSelect: function(e) {
    this.setData({
      isRead: e.currentTarget.dataset.id
    })
  },
  pageChange: async function(e) {
    this.setData({
      isLoad: false
    })
    var curPage = Number(e.detail.value) + 1
    var curReadArray = this.data.readArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curReadArray: curReadArray
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
  nextPage: async function(e) {
    if (this.data.curPage >= this.data.pageNum) {
      return
    }
    this.setData({
      isLoad: false
    })
    var curPage = this.data.curPage + 1
    var curReadArray = this.data.readArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    console.log(curPage, curReadArray, e.detail)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curReadArray: curReadArray
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
  lastPage: async function(e) {
    if (this.data.curPage <= 1) {
      return
    }
    this.setData({
      isLoad: false
    })
    var curPage = this.data.curPage - 1
    var curReadArray = this.data.readArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curReadArray: curReadArray
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
  tapOfflineReject: async function(e) {
    const {index} = e.currentTarget.dataset
    // var unreadArray = this.data.unreadArray
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "handleOffline",
        messageId: this.data.unreadArray[index]._id,
        result: 0,
        avatarUrl: app.globalData.userInfo.avatarUrl
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    wx.hideLoading()
    if (result.code == 0) {
      wx.showToast({
        title: '操作成功',
        icon: "success"
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else if (result.code == 1) {
      wx.showToast({
        title: '已被处理',
        icon: "none"
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }
  },
  tapOfflineAgree: async function(e) {
    const {index} = e.currentTarget.dataset
    var unreadArray = this.data.unreadArray
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "handleOffline",
        messageId: unreadArray[index]._id,
        result: 1,
        avatarUrl: app.globalData.userInfo.avatarUrl
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    wx.hideLoading()
    if (result.code == 0) {
      wx.showToast({
        title: '操作成功',
        icon: "success"
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else if (result.code == 1) {
      wx.showToast({
        title: '已被处理',
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }

  },
  tapOnlineReject: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {index} = e.currentTarget.dataset
    var unreadArray = this.data.unreadArray
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "handleOnline",
        messageId: unreadArray[index]._id,
        result: 0,
        avatarUrl: app.globalData.userInfo.avatarUrl
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    wx.hideLoading()
    if (result.code == 0) {
      wx.showToast({
        title: '操作成功',
        icon: "success"
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else if (result.code == 1) {
      wx.showToast({
        title: '已被处理',
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }

  },
  tapOnlineAgree: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    const {index} = e.currentTarget.dataset
    var unreadArray = this.data.unreadArray
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "handleOnline",
        messageId: unreadArray[index]._id,
        result: 1,
        avatarUrl: app.globalData.userInfo.avatarUrl
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    if (result.code == 0) {
      wx.showToast({
        title: '操作成功',
        icon: "success"
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else if (result.code == 1) {
      wx.showToast({
        title: '已被处理',
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }
  },
  tapNickNameReject: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {index} = e.currentTarget.dataset
    var unreadArray = this.data.unreadArray
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "handleNickName",
        messageId: unreadArray[index]._id,
        result: 0,
        avatarUrl: app.globalData.userInfo.avatarUrl
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
        title: '操作成功',
        icon: "success"
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else if (result.code == 1) {
      wx.showToast({
        title: '已被处理',
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }
  },
  tapNickNameAgree: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const {index} = e.currentTarget.dataset
    var unreadArray = this.data.unreadArray
    const {result} = await wx.cloud.callFunction({
      name: "messageHelper",
      data: {
        action: "handleNickName",
        messageId: unreadArray[index]._id,
        result: 1,
        avatarUrl: app.globalData.userInfo.avatarUrl
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
        title: '操作成功',
        icon: "success"
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else if (result.code == 1) {
      wx.showToast({
        title: '已被处理',
      })
      var unreadArrayResultMsg = "unreadArray[" + index + "].resultMsg"
      var unreadArrayRead = "unreadArray[" + index + "].read"
      this.setData({
        [unreadArrayRead]: true,
        [unreadArrayResultMsg]: result.resultMsg
      })
      app.globalData.msgNum -= 1
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }
  },
})