// miniprogram/pages/aboutPage/myRepairSheet/myRepairSheet.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sheetArray: [],
    curSheets: [],
    pageSize: 10,
    curPage: 1,
    pageNum: 0,
    total: 0,
    feedback: null,
    curIndex: null,
    pageArray: [],
    score: 5,
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
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "getMySheets",
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
      for (let i = 1; i<= Math.ceil(result.total / 10); i++) {
        pageArray.push(i)
      }
      var sheetArray = result.mySheets
      for (let i in sheetArray) {
        let createdTime = new Date(new Date(sheetArray[i].createdTime).getTime() + 8*60*60*1000).toISOString()
        let temp = createdTime.split("T")
        let create = temp[0] + " " + temp[1].split(".")[0]
        sheetArray[i].create = create
      }
      var curSheets = sheetArray.slice(0, this.data.pageSize)
      console.log(curSheets, result.mySheets)
      this.setData({
        isLoad: true,
        pageNum: Math.ceil(result.total / 10),
        sheetArray: sheetArray,
        pageArray: pageArray,
        curSheets: curSheets,
        total: result.mySheets.length
      })
    } else {
      this.setData({
        isLoad: true
      })
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
  pageChange: async function(e) {
    this.setData({
      isLoad: false
    })
    var curPage = Number(e.detail.value) + 1
    var curSheets = this.data.sheetArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curSheets: curSheets
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
  tapCancel: async function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var index = e.currentTarget.dataset['index']
    if (typeof(index) == "undefined") {
      wx.showToast({
        title: '出现罕见bug_0，再点一次吧',
        icon: "none"
      })
      return
    }
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "cancel",
        _id: this.data.curSheets[index]._id
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
      var sheetArray = this.data.sheetArray
      var curSheets = this.data.curSheets
      curSheets[index].state = -1
      sheetArray[(this.data.curPage-1)*10+index].state = -1
      this.setData({
        sheetArray: sheetArray,
        curSheets: curSheets
      })
      wx.showToast({
        title: '取消成功',
        icon: "success"
      })
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
    }
  },
  tapDetail: function(e) {
    var index = e.currentTarget.dataset['index']
    if (typeof(index) == "undefined") {
      wx.showToast({
        title: '出现罕见bug_0，再点一次吧',
        icon: "none"
      })
    } else {
      wx.navigateTo({
        url: '/pages/aboutPage/detailSheet/detailSheet?sheetId=' + this.data.curSheets[index]._id,
      })
    }
  },
  nextPage: function(e) {
    if (this.data.curPage >= this.data.pageNum) {
      return
    }
    this.setData({
      isLoad: false
    })
    var curPage = this.data.curPage + 1
    var curSheets = this.data.sheetArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curSheets: curSheets
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
  lastPage: function(e) {
    if (this.data.curPage <= 1) {
      return
    }
    this.setData({
      isLoad: false
    })
    var curPage = this.data.curPage - 1
    var curSheets = this.data.sheetArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curSheets: curSheets
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
  inputFeedback: function(e) {
    this.setData({
      feedback: e.detail.value
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
    var score = 5
    if (!!this.data.curSheets[index].score) {
      score = this.data.curSheets[index].score
    }
    this.setData({
      curIndex: index,
      modalName: "feedback",
      feedback: this.data.curSheets[index]['feedback'],
      score: score
    })
  },
  hideModal: function(e) {
    this.setData({
      curIndex: null,
      feedback: null,
      modalName: null
    })
  },
  tapFeedback: async function(e) {
    if (this.data.feedback == "" || !this.data.feedback) {
      wx.showToast({
        title: '评价内容不能为空',
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var _id = this.data.curSheets[this.data.curIndex]._id
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "postFeedback",
        feedback: this.data.feedback,
        score: this.data.score,
        _id: _id
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        feedback: null,
        curIndex: null,
        score: 5,
        modalName: null
      })
      return
    })
    wx.hideLoading()
    if (result.code == 0) {
      // var curSheets = this.data.curSheets
      // var sheetArray = this.data.sheetArray
      // curSheets[this.data.curIndex]['feedback'] = this.data.feedback
      // sheetArray[(this.data.curPage-1)*10+this.data.curIndex]['feedback'] = this.data.feedback
      // curSheets[this.data.curIndex]['state'] = 3
      // sheetArray[(this.data.curPage-1)*10+this.data.curIndex]['state'] = 3
      // this.setData({
      //   feedback: null,
      //   curIndex: null,
      //   modalName: null,
      //   score: 5,
      //   curSheets: curSheets,
      //   sheetArray: sheetArray
      // })
      var curSheetsFeedback = "curSheets[" + this.data.curIndex + "].feedback"
      var curSheetsScore = "curSheets[" + this.data.curIndex + "].score"
      var curSheetsState = "curSheets[" + this.data.curIndex + "].state"
      var sheetArrayFeedback = "sheetArray[" + (this.data.curPage-1)*10+this.data.curIndex + "].feedback"
      var sheetArrayScore = "sheetArray[" + (this.data.curPage-1)*10+this.data.curIndex + "].score"
      var sheetArrayState = "sheetArray[" + (this.data.curPage-1)*10+this.data.curIndex + "].state"
      this.setData({
        feedback: null,
        curIndex: null,
        modalName: null,
        score: 5,
        [curSheetsFeedback]: this.data.feedback,
        [curSheetsScore]: this.data.score,
        [sheetArrayFeedback]: this.data.feedback,
        [sheetArrayScore]: this.data.score,
        [curSheetsState]: 3,
        [sheetArrayState]: 3
      })
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
        feedback: null,
        curIndex: null,
        modalName: null,
        score: 5
      })
    }
  },
  getScore: function(e) {
    var score = e.currentTarget.dataset.score
    console.log(score)
    this.setData({
      score: score
    })
  }
})