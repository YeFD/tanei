//app.js
App({
  onLaunch: function () {
    try {
      wx.login()
      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let capsule = wx.getMenuButtonBoundingClientRect();
          if (capsule) {
            this.globalData.Custom = capsule;
            this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
          } else {
            this.globalData.CustomBar = e.statusBarHeight + 50;
          }
        }
      })
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          // env 参数说明：
          //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
          //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
          //   如不填则使用默认环境（第一个创建的环境）
          env: 'dist-3gfsowkhc324384b',
          // env: "demo-vr23l",
          traceUser: true,
        })
        wx.cloud.callFunction({
          name: "statisticsHelper",
          data: {
            action: "visit"
          }
        })
      }
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    updateManager.applyUpdate()
                  } else if (res.cancel) {
                    wx.showModal({
                      title: '温馨提示',
                      content: '本次更新可能会导致旧版本无法正常访问，请使用新版本',
                      success: function (res) {
                        self.autoUpdate()
                      }
                    })
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              })
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用部分功能，请升级到最新微信版本后重试。'
        })
      }
    } catch (e) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用部分功能，请升级到最新微信版本后重试。'
      })
    }
  },
  globalData: {
    userInfo: null,
    adminInfo: null,
    identity: 0,
    msgNum: 0,
  }
})
