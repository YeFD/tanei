Page({
  data: {
    pageSize: 10,
    tabIndex: 0,
    tabArray: ["正在进行", "已完成"],
    curPage: 1,
    pageArray: null,
    pageNum: 0,
    pageSize: 20,
    // total: 0,
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
  onLoad: async function (options) {
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "getAllSheets",
        onLoad: true,
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
      // console.log(result.completedSheets)
      var pageArray = []
      var pageNum = Math.ceil(result.num / this.data.pageSize)
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
        // total: completedSheets.length,
        pageNum: pageNum,
        ingSheets: ingSheets,
        completedSheets: completedSheets,
        curSheets: curSheets
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
    if ((curPage-1) - (curPage-1) % 5 == (this.data.curPage-1) - (this.data.curPage-1) % 5) {
      var curSheets = this.data.completedSheets.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
      this.setData({
        isLoad: true,
        curPage: curPage,
        curSheets: curSheets,
      })
    } else {
      const {result} = await wx.cloud.callFunction({
        name: "repairSheetHelper",
        data: {
          action: "getAllSheets",
          skipPageNum: (curPage-1) - (curPage-1) % 5,
          pageSize: this.data.pageSize,
          onLoad: false
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
        var completedSheets = result.completedSheets
        for (let i in completedSheets) {
          let createdTime = new Date(new Date(completedSheets[i].createdTime).getTime() + 8*60*60*1000).toISOString()
          let temp = createdTime.split("T")
          let create = temp[0] + " " + temp[1].split(".")[0]
          completedSheets[i].create = create
        }
        var curSheets = completedSheets.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
        this.setData({
          isLoad: true,
          completedSheets: completedSheets,
          curSheets: curSheets,
          curPage
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
      var curSheets = this.data.completedSheets.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
      this.setData({
        isLoad: true,
        curPage: curPage,
        curSheets: curSheets
      })
    } else {
      const {result} = await wx.cloud.callFunction({
        name: "repairSheetHelper",
        data: {
          action: "getAllSheets",
          skipPageNum: (curPage-1) - (curPage-1) % 5,
          pageSize: this.data.pageSize,
          onLoad: false
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
        var completedSheets = result.completedSheets
        for (let i in completedSheets) {
          let createdTime = new Date(new Date(completedSheets[i].createdTime).getTime() + 8*60*60*1000).toISOString()
          let temp = createdTime.split("T")
          let create = temp[0] + " " + temp[1].split(".")[0]
          completedSheets[i].create = create
        }
        var curSheets = completedSheets.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
        this.setData({
          isLoad: true,
          curPage,
          completedSheets: completedSheets,
          curSheets
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
      var curSheets = this.data.completedSheets.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
      this.setData({
        isLoad: true,
        curPage: curPage,
        curSheets: curSheets
      })
    } else {
      const {result} = await wx.cloud.callFunction({
        name: "repairSheetHelper",
        data: {
          action: "getAllSheets",
          skipPageNum: (curPage-1) - (curPage-1) % 5,
          pageSize: this.data.pageSize,
          onLoad: false
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
        var completedSheets = result.completedSheets
        for (let i in completedSheets) {
          let createdTime = new Date(new Date(completedSheets[i].createdTime).getTime() + 8*60*60*1000).toISOString()
          let temp = createdTime.split("T")
          let create = temp[0] + " " + temp[1].split(".")[0]
          completedSheets[i].create = create
        }
        var curSheets = completedSheets.slice((curPage-1)%5*this.data.pageSize, ((curPage-1)%5+1)*this.data.pageSize)
        this.setData({
          isLoad: true,
          curPage,
          completedSheets: completedSheets,
          curSheets
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
  tapDetail: function(e) {
    var {index} = e.currentTarget.dataset
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
})