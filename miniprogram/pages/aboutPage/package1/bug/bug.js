Page({
  data: {
  },
  onLoad: function (options) {

  },
  tapRe: async function(e) { 
    // console.log("tapRe") 
    // this.selectComponent("#custom").reBug() 
    // this.onLoad() 
    // const {result} = await wx.cloud.callFunction({
    //   name: "repairSheetHelper",
    //   data: {
    //     action: "test"
    //   }
    // }).catch(e => {
    //   console.log(e)
    //   this.setData({
    //     isLoad: true
    //   })
    //   wx.showToast({
    //     title: '网络错误',
    //     icon: "none"
    //   })
    //   return
    // })
    // console.log(result)
  }, 
  tapFixBug: function(e) { 
    console.log(this.selectComponent("#custom").data) 
    wx.getSystemInfo({ 
      success: e => { 
        app.globalData.StatusBar = e.statusBarHeight; 
        let capsule = wx.getMenuButtonBoundingClientRect(); 
        if (capsule) { 
          app.globalData.Custom = capsule; 
          app.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight; 
        } else { 
          app.globalData.CustomBar = e.statusBarHeight + 50; 
        } 
      } 
    }) 
    this.selectComponent("#custom").fixBug() 
    wx.showToast({ 
      title: '如果刷新页面后仍未修复，请尝试重新进入小程序', 
      icon: "none", 
      duration: 3000 
    }) 
  }
})