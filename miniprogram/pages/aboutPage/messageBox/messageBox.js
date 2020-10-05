// miniprogram/pages/aboutPage/messageBox/messageBox.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
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

  /**
   * 生命周期函数--监听页面加载
   */
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
  tapRead: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // var unreadArray = this.data.unreadArray
    const {index} = e.target.dataset
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
      url: '/pages/aboutPage/myReceivedRepairSheet/myReceivedRepairSheet',
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
    // console.log(e.detail.value, Number(e.detail) + 1)
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
    // const {result} = await wx.cloud.callFunction({
    //   name: "messageHelper",
    //   data: {
    //     action: "getReadMessageArray",
    //     curPage,
    //     pageSize: this.data.pageSize,
    //     unreadMessageNum: this.data.unreadMessageNum
    //   }
    // })
    // if (result.code === 0) {
    //   console.log(result)
    //   var readArray = result.messageArray
    //   for (let i in readArray) {
    //     let sentTime = new Date(new Date(readArray[i].sentTime).getTime() + 8*60*60*1000).toISOString()
    //     let temp = sentTime.split("T")
    //     let time = temp[0] + " " + temp[1].split(".")[0]
    //     readArray[i].time = time
    //   }
    //   this.setData({
    //     curPage: curPage,
    //     readArray: readArray
    //   })
    // }
  },
  nextPage: async function(e) {
    if (this.data.curPage >= this.data.pageNum) {
      return
    }
    // wx.showLoading({
    //   title: '加载中',
    // })
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
    const {index} = e.target.dataset
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
      // unreadArray[index].resultMsg = result.resultMsg
      // unreadArray[index].read = true
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
    const {index} = e.target.dataset
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
    const {index} = e.target.dataset
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

    const {index} = e.target.dataset
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
    const {index} = e.target.dataset
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
    const {index} = e.target.dataset
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