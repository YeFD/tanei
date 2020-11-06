// pages/homePage/home/home.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true,
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
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
