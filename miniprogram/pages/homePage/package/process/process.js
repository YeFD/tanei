// pages/homePage/package/process/process.js
Page({
  data: {
    botAvatarUrl: "https://6469-dist-3gfsowkhc324384b-1259081600.tcb.qcloud.la/image/defaultAvatar.jpg",
    SAAvatarUrl: "https://6469-dist-3gfsowkhc324384b-1259081600.tcb.qcloud.la/userAvatar/SAAvatar.png"
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