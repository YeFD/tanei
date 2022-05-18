const app = getApp()
import WxValidate from "../../../../utils/WxValidate"
// miniprogram/pages/aboutPage/identify/identify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    department: ["技术部"],
    // isGanShi: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.identity == 0) {
      wx.showToast({
        title: "请先登陆",
        icon: "none",
        success: (res) => {
          setTimeout(
            () => {
              wx.navigateBack({
                delta: 1,
              })
            }
          , 1500)
        }
      })
    }
    this.initValidate()
  },
  identify: async function(e) {
    let params = e.detail.value
    if (!this.WxValidate.checkForm(params)) {
      let error = this.WxValidate.errorList[0]
      wx.showToast({
        title: error.msg,
        icon: "none"
      })
      return false
    } else {
      console.log("ok")
    }
    const {name, email, department, password, wechat} = e.detail.value
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "identify",
        name, email, department, password, wechat,
        avatarUrl: app.globalData.userInfo.avatarUrl
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    })
    wx.hideLoading()
    if (result.code === 0) {
      app.globalData.identity = result.identity
      var adminInfo = {
        name, email, department, wechat, 
        ingNum: result.ingNum,
        completedNum: result.completedNum,
        totalNum: result.totalNum,
        identity: result.identity2,
        _id: result.adminId,
        nickName: null
      }
      app.globalData.adminInfo = adminInfo
      wx.showToast({
        title: "认证成功！",
        icon: "success",
        success: (res) => {
          setTimeout(
            () => {
              wx.navigateBack({
                delta: 1,
              })
            }
          , 1000)
        }
      })
    } else {
      wx.showToast({
        title: result.message,
        icon: "none"
      })
    }
  },
  initValidate: function() {
    let rules = {
      name: {
        required: true,
        maxlength: 10
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true
      },
      wechat: {
        required: true
      }
    }
    let message = {
      name: {
        required: "请输入姓名",
        maxlength: "名字不能超过10个字"
      },
      email: {
        required: "请输入email",
        tel: "请输入正确的email"
      },
      password: {
        required: "请输入密匙"
      },
      wechat: {
        required: "请输入微信"
      }
    }
    this.WxValidate = new WxValidate(rules, message)
  }
})