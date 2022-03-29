
// miniprogram/pages/aboutPage/myReceivedRepairSheet/myReceivedRepairSheet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    tabArray: ["正在进行", "已完成"],
    curPage: 1,
    pageArray: null,
    pageSize: 10,
    pageNum: 1,
    total: 0,
    summary: null,
    curIndex: null,
    ingSheets: [],
    completedSheets: [],
    curSheets: [],
    stateMsg: [
      {
        color: "red",
        msg: "已取消"
      },
      {
        color: "blue",
        msg: "等待接单"
      },
      {
        color: "olive",
        msg: "已接单"
      }, {
        color: "green",
        msg: "已完成"
      },
      {
        color: "yellow",
        msg: "已评价"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "getRepairmanSheets",
        // pageSize: 10
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
      var pageNum = Math.ceil(result.total / 10)
      for (let i = 1; i <= pageNum; i++) {
        pageArray.push(i)
      }
      var ingSheets = result.ingSheets
      var completedSheets = result.completedSheets
      for (let i in ingSheets) {
        let createdTime = new Date(new Date(ingSheets[i].createdTime).getTime() + 8*60*60*1000).toISOString()
        let temp = createdTime.split("T")
        let create = temp[0] + " " + temp[1].split(".")[0]
        ingSheets[i].create = create
      }
      for (let i in completedSheets) {
        let createdTime = new Date(new Date(completedSheets[i].createdTime).getTime() + 8*60*60*1000).toISOString()
        let temp = createdTime.split("T")
        let create = temp[0] + " " + temp[1].split(".")[0]
        completedSheets[i].create = create
      }
      var curSheets = completedSheets.slice(0, this.data.pageSize)
      this.setData({
        isLoad: true,
        pageArray: pageArray,
        total: result.total,
        pageNum: pageNum,
        ingSheets: result.ingSheets,
        completedSheets: result.completedSheets,
        curSheets: curSheets
      })
      app.globalData.adminInfo.ingNum = ingSheets.length
      app.globalData.adminInfo.totalNum = completedSheets.length + ingSheets.length
    } else {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '获取失败',
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
      tabIndex: e.currentTarget.dataset.id
    })
  },
  pageChange: async function(e) {
    this.setData({
      isLoad: false
    })
    var curPage = Number(e.detail.value) + 1
    var curSheets = this.data.completedSheets.slice((curPage - 1) * this.data.pageSize, curPage * this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curSheets: curSheets
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
    // wx.hideLoading()
  },
  nextPage: async function(e) {
    if (this.data.curPage >= this.data.pageNum) {
      return
    }
    this.setData({
      isLoad: false
    })
    var curPage = this.data.curPage + 1
    var curSheets = this.data.completedSheets.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curSheets: curSheets
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
    var curSheets = this.data.completedSheets.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curSheets: curSheets
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
  tapDetail: function(e) {
    var {index} = e.currentTarget.dataset
    if (typeof(index) == "undefined") {
      console.log(e, e.currentTarget.dataset, index)
      wx.showToast({
        title: '出现罕见bug_0，再点一次吧',
        icon: "none"
      })
      return
    }
    if (this.data.tabIndex == 0) {
      wx.navigateTo({
        url: '/pages/aboutPage/detailSheet/detailSheet?sheetId=' + this.data.ingSheets[index]._id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/aboutPage/detailSheet/detailSheet?sheetId=' + this.data.curSheets[index]._id,
      })
    }
  },
  tapCancel: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var index = e.currentTarget.dataset['index']
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "cancel",
        _id: this.data.ingSheets[index]._id
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
      var ingSheets = this.data.ingSheets
      ingSheets[index].state = -1
      this.setData({
        ingSheets: ingSheets,
      })
      wx.showToast({
        title: '取消成功',
        icon: "success"
      })
      app.globalData.adminInfo.ingNum -= 1
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }
  },
  tapReceive: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var index = e.currentTarget.dataset['index']
    if (typeof(index) == "undefined") {
      console.log(e, e.currentTarget.dataset, index)
      wx.showToast({
        title: '出现罕见bug_0，再点一次吧',
        icon: "none"
      })
      return
    }
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "receive",
        _id: this.data.ingSheets[index]._id
      }
    }).catch((e) => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    wx.hideLoading()
    if (result.code === 0) {
      var ingSheets = this.data.ingSheets
      ingSheets[index].state = 1
      this.setData({
        ingSheets: ingSheets
      })
      wx.showToast({
        title: '接单成功',
      })
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }
  },
  tapComplete: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var index = e.currentTarget.dataset['index']
    if (typeof(index) == "undefined") {
      console.log(e, e.currentTarget.dataset, index)
      wx.showToast({
        title: '出现罕见bug_0，再点一次吧',
        icon: "none"
      })
      return
    }
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "complete",
        _id: this.data.ingSheets[index]._id,
        avatarUrl: app.globalData.userInfo.avatarUrl
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    })
    wx.hideLoading()
    if (result.code === 0) {
      var ingSheets = this.data.ingSheets
      ingSheets[index].state = 2
      this.setData({
        ingSheets: ingSheets
      })
      wx.showToast({
        title: '操作成功',
        icon: "success"
      })
      app.globalData.adminInfo.ingNum -= 1
      app.globalData.adminInfo.completedNum += 1
    } else {
      wx.showToast({
        title: '返回错误',
        icon: "none"
      })
    }
  },
  tapSummary: async function(e) {
    if (this.data.summary == "" || !this.data.summary) {
      wx.showToast({
        title: '总结内容不能为空',
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var _id;
    if (this.data.tabIndex == 0) {
      _id = this.data.ingSheets[this.data.curIndex]._id
    } else {
      _id = this.data.curSheets[this.data.curIndex]._id
    }
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "postSummary",
        summary: this.data.summary,
        adminId: app.globalData.adminInfo._id,
        _id: _id
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        summary: null,
        curIndex: null,
        modalName: null
      })
      return
    })
    wx.hideLoading()
    if (result.code == 0) {
      if (this.data.tabIndex == 0) {
        var ingSheets = this.data.ingSheets
        ingSheets[this.data.curIndex]['summary'] = this.data.summary
        this.setData({
          summary: null,
          curIndex: null,
          modalName: null,
          ingSheets: ingSheets
        })
      } else {
        var curSheets = this.data.curSheets
        var completedSheets = this.data.completedSheets
        curSheets[this.data.curIndex]['summary'] = this.data.summary
        completedSheets[(this.data.curPage-1)*10+this.data.curIndex]['summary'] = this.data.summary
        this.setData({
          summary: null,
          curIndex: null,
          modalName: null,
          curSheets: curSheets,
          completedSheets: completedSheets
        })
      }
      wx.showToast({
        title: '提交成功',
        icon: "success"
      })
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
      this.setData({
        summary: null,
        curIndex: null,
        modalName: null
      })
    }
  },
  inputSummary: function(e) {
    this.setData({
      summary: e.detail.value
    })
  },
  showModal: function(e) {
    var index = e.currentTarget.dataset['index']
    if (typeof(index) == "undefined") {
      console.log(e, e.currentTarget.dataset, index)
      wx.showToast({
        title: '出现罕见bug_0，再点一次吧',
        icon: "none"
      })
      return
    }
    var summary
    if (this.data.tabIndex == 0) {
      summary = this.data.ingSheets[index]['summary']
    } else {
      summary = this.data.curSheets[index]['summary']
    }
    this.setData({
      curIndex: index,
      modalName: "summary",
      summary: summary
    })
  },
  hideModal: function(e) {
    this.setData({
      curIndex: null,
      summary: null,
      modalName: null
    })
  },
})