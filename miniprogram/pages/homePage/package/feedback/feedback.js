Page({
  data: {
    feedbackArray: [],
    curFeedback: [],
    pageSize: 20,
    curPage: 1,
    pageNum: 0,
    // curPageIndex: 1,
    // total: 0,
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
  onLoad: async function (options) {
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "getUserFeedback",
        skipPageNum: this.data.curPage - this.data.curPage % 5,
        pageSize: this.data.pageSize
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
      for (let i = 1; i<= Math.ceil(result.num / this.data.pageSize); i++) {
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
        pageNum: Math.ceil(result.num / this.data.pageSize),
        // maxPageNum: result.num,
        feedbackArray: feedbackArray,
        pageArray: pageArray,
        curFeedback: curFeedback,
        // total: feedbackArray.length
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
  pageChange: async function(e) {
    this.setData({
      isLoad: false
    })
    var curPage = Number(e.detail.value) + 1
    if ((curPage-1) - (curPage-1) % 5 == (this.data.curPage-1) - (this.data.curPage-1) % 5) {
      var curFeedback = this.data.feedbackArray.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
      this.setData({
        isLoad: true,
        curPage: curPage,
        curFeedback: curFeedback
      })
    } else {
      // console.log("need call function")
      const {result} = await wx.cloud.callFunction({
        name: "repairSheetHelper",
        data: {
          action: "getUserFeedback",
          skipPageNum: (curPage-1) - (curPage-1) % 5,
          pageSize: this.data.pageSize
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
        var feedbackArray = result.feedback
        for (let i in feedbackArray) {
          let feedbackTime = new Date(new Date(feedbackArray[i].feedbackTime).getTime() + 8*60*60*1000).toISOString()
          let temp = feedbackTime.split("T")
          let time = temp[0] + " " + temp[1].split(".")[0]
          feedbackArray[i].time = time
        }
        var curFeedback = feedbackArray.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
        this.setData({
          isLoad: true,
          curPage: curPage,
          feedbackArray: feedbackArray,
          curFeedback: curFeedback,
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
    }
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
    if ((curPage-1) - (curPage-1) % 5 == (this.data.curPage-1) - (this.data.curPage-1) % 5) {
      var curFeedback = this.data.feedbackArray.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
      this.setData({
        isLoad: true,
        curPage: curPage,
        curFeedback: curFeedback
      })
    } else {
      console.log("need call function")
      const {result} = await wx.cloud.callFunction({
        name: "repairSheetHelper",
        data: {
          action: "getUserFeedback",
          skipPageNum: (curPage-1) - (curPage-1) % 5,
          pageSize: this.data.pageSize
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
        var feedbackArray = result.feedback
        for (let i in feedbackArray) {
          let feedbackTime = new Date(new Date(feedbackArray[i].feedbackTime).getTime() + 8*60*60*1000).toISOString()
          let temp = feedbackTime.split("T")
          let time = temp[0] + " " + temp[1].split(".")[0]
          feedbackArray[i].time = time
        }
        var curFeedback = feedbackArray.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
        this.setData({
          isLoad: true,
          curPage: curPage,
          feedbackArray: feedbackArray,
          curFeedback: curFeedback,
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
    }
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
    if ((curPage-1) - (curPage-1) % 5 == (this.data.curPage-1) - (this.data.curPage-1) % 5) {
      var curFeedback = this.data.feedbackArray.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
      this.setData({
        isLoad: true,
        curPage: curPage,
        curFeedback: curFeedback
      })
    } else {
      console.log("need call function")
      const {result} = await wx.cloud.callFunction({
        name: "repairSheetHelper",
        data: {
          action: "getUserFeedback",
          skipPageNum: (curPage-1) - (curPage-1) % 5,
          pageSize: this.data.pageSize
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
        var feedbackArray = result.feedback
        for (let i in feedbackArray) {
          let feedbackTime = new Date(new Date(feedbackArray[i].feedbackTime).getTime() + 8*60*60*1000).toISOString()
          let temp = feedbackTime.split("T")
          let time = temp[0] + " " + temp[1].split(".")[0]
          feedbackArray[i].time = time
        }
        var curFeedback = feedbackArray.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
        this.setData({
          isLoad: true,
          curPage: curPage,
          feedbackArray: feedbackArray,
          curFeedback: curFeedback,
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
    }
    wx.pageScrollTo({
      scrollTop: true,
    })
  },
})