// pages/homePage/home/home.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
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
    text: "【单项成绩】页包含了详细的单项打分情况及成绩雷达图，直观地看出自己的弱项和强项。",
    msgList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },
  lifetimes: {
    attached: function() {
      var msgList = []
      for (let i = 0; i*16 < this.data.text.length; i++) {
        msgList[i] = this.data.text.substr(16*i, 16)
      }
      console.log(msgList)
      this.setData({
        msgList
      })
    }
  },
  pageLifetimes: {
    show: function() {
    }
  }
})
