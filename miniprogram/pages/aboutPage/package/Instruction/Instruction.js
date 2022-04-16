// pages/aboutPage/package/Instruction/Instruction.js
const app = getApp()
Page({
  data: {
    identityList: ["干事", "部长", "会长", "老人", "SA"],
    botAvatarUrl: "https://6465-demo-vr23l-1259081600.tcb.qcloud.la/image/defaultAvatar.jpg",
    SAAvatarUrl: "https://6469-dist-3gfsowkhc324384b-1259081600.tcb.qcloud.la/userAvatar/SAAvatar.png"
  },
  onLoad: function (options) {
    if (app.globalData.identity <= 1) {
      wx.showToast({
        title: '权限不足',
        icon: "none"
      })
      wx.navigateBack({
        delta: 1,
      })
    }
    this.setData({
      identity: app.globalData.identity,
    })
  },
  copyData: function(e) {
    wx.setClipboardData({
      data: "i-am-xiaoji",
      success: res => {
        wx.showToast({
          title: '已复制微信号',
        })
      }
    })
  },
})