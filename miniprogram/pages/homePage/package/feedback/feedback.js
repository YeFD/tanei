// miniprogram/pages/homePage/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackArray: [],
    curFeedback: [],
    pageSize: 10,
    curPage: 1,
    pageNum: 0,
    total: 0,
    pageArray: [],
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "getUserFeedback"
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
      for (let i = 1; i<= Math.ceil(result.feedback.length / 10); i++) {
        pageArray.push(i)
      }
      var feedbackArray = result.feedback
      for (let i in feedbackArray) {
        let feedbackTime = new Date(new Date(feedbackArray[i].feedbackTime).getTime() + 8*60*60*1000).toISOString()
        let temp = feedbackTime.split("T")
        let time = temp[0] + " " + temp[1].split(".")[0]
        feedbackArray[i].time = time
      }
      var curFeedback = feedbackArray.slice(0, this.data.pageSize)
      this.setData({
        isLoad: true,
        pageNum: Math.ceil(feedbackArray.length / 10),
        feedbackArray: feedbackArray,
        pageArray: pageArray,
        curFeedback: curFeedback,
        total: feedbackArray.length
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
    var curFeedback = this.data.feedbackArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curFeedback: curFeedback
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
  nextPage: function(e) {
    if (this.data.curPage >= this.data.pageNum) {
      return
    }
    this.setData({
      isLoad: false
    })
    var curPage = this.data.curPage + 1
    var curFeedback = this.data.feedbackArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curFeedback: curFeedback
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
    var curFeedback = this.data.feedbackArray.slice((curPage-1)*this.data.pageSize, curPage*this.data.pageSize)
    this.setData({
      isLoad: true,
      curPage: curPage,
      curFeedback: curFeedback
    })
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
})