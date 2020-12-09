const app = getApp()
Component({
  properties: {

  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  data: {
    elements: [
      {
        title: "免费报修",
        name: "repair",
        color: "pink",
        icon: "repair",
        path: "repairSheet/repairSheet"
      },
      {
        title: "数据展示",
        name: "statistics",
        color: "blue",
        icon: "news",
        path: "package/statistics/statistics"
      },
      {
        title: "用户评价",
        name: "feedback",
        color: "orange",
        icon: "comment",
        path: "package/feedback/feedback"
      }
    ],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    notice: "",
    msgList: []
  },
  methods: {
    
  },
  lifetimes: {
    attached: async function() {
      const {result} = await wx.cloud.callFunction({
        name: "adminHelper",
        data: {
          action: "getNotice"
        }
      }).catch(e => {
        return
      })
      if (result.code == 0) {
        const {notice} = result
        var msgList = []
        for (let i = 0; i*13 < notice.length; i++) {
          msgList[i] = notice.substr(13*i, 13)
        }
        if (msgList.length == 1) {
          msgList[1] = ""
        }
        this.setData({
          notice,
          msgList
        })
      }
    }
  },
  pageLifetimes: {
    show: async function() {
      const {result} = await wx.cloud.callFunction({
        name: "adminHelper",
        data: {
          action: "getNotice"
        }
      }).catch(e => {
        return
      })
      if (result.code == 0) {
        const {notice} = result
        if (notice == this.data.notice) {
          return
        }
        var msgList = []
        for (let i = 0; i*13 < notice.length; i++) {
          msgList[i] = notice.substr(13*i, 13)
        }
        this.setData({
          notice,
          msgList
        })
      }
    }
  }
})
