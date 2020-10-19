// miniprogram/pages/homePage/repairSheet/repairSheet.js
import WxValidate from "../../../utils/WxValidate"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    repairTypeCurIndex: 0,
    repairType: [
      {
        name: "送修",
        checked: true
      }, {
        name: "上门"
      }
    ],
    faultTypeCurIndex: 0,
    faultType: [
      {
        name: "能开机能进系统",
        checked: true
      }, {
        name: "能开机不能进系统",
      }, {
        name: "不能开机"
      }
    ],
    computerTypeCurIndex: 0,
    computerType: [
      {
        name: "笔记本",
        checked: true
      }, {
        name: "台式电脑"
      }, {
        name: "手机/平板"
      }
    ],
    // faultType: ["能开机能进系统", "能开机不能进系统", "不能开机"],
    // computerType: ["笔记本", "台式电脑", "手机/平板"],
    repairmanCurIndex: 0,
    repairmanArray: null,
    submitFlag: false,
    isLoad: false,
    identity: 0,
    detailMsg: "请详细描述故障以便我们提供更好的帮助"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.initValidate()
    const {result} = await wx.cloud.callFunction({
      name: "adminHelper",
      data: {
        action: "getOnlineAdminArray"
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        identity: app.globalData.identity,
        isLoad: true
      })
      return
    })
    if (result.code == 0) {
      if (result.adminArray.length == 0) {
        wx.showToast({
          title: '暂无维修人员',
          icon: "none"
        })
        this.setData({
          isLoad: true,
        })
        return
      }
      var repairmanArray = result.adminArray
      function randomSort(a, b) {
        return Math.random() > 0.5 ? -1 : 1;
      }
      repairmanArray.sort(randomSort)
      repairmanArray[0]['checked'] = true
      this.setData({
        repairmanArray: repairmanArray,
        isLoad: true,
        identity: app.globalData.identity
      })
    } else {
      wx.showToast({
        title: '请求错误',
        icon: "none"
      })
      this.setData({
        identity: app.globalData.identity,
        isLoad: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  submitSheet: async function(e) {
    if (this.data.identity == 0) {
      this.setData({
        detailMsg: null,
        modalName: "getUserInfo"
      })
      return
    }

    if (this.data.submitFlag) {
      wx.showToast({
        title: "请勿重复提交",
        icon: "none",
        // success: (res) => {
        //   setTimeout(
        //     () => {
        //       wx.navigateBack({
        //         delta: 1,
        //       })
        //     }
        //   , 1000)
        // }
      })
      return
    }
    console.log("submit", e.detail)
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
    // wx.showLoading({
    //   title: '请稍后',
    //   mask: true
    // })
    this.setData({
      loading: true
    })
    const {userName, userPhone, userAddress, userWechat, computerType, repairType, faultType, faultDetail, repairmanIndex} = e.detail.value
    var repairman = this.data.repairmanArray[repairmanIndex].name
    var repairmanId = this.data.repairmanArray[repairmanIndex].openId
    var userAvatarUrl = app.globalData.userInfo.avatarUrl
    var {email, identity, nickName, wechat, avatarUrl} = this.data.repairmanArray[repairmanIndex]
    // console.log(repairmanIndex, this.data.repairmanArray, repairman, repairmanId)
    const {result} = await wx.cloud.callFunction({
      name: "repairSheetHelper",
      data: {
        action: "postSheet",
        userName, userPhone, userAddress, userWechat, computerType, repairType, faultType, faultDetail, repairman, repairmanId, userAvatarUrl, nickName, identity, email, wechat, avatarUrl
      }
    }).catch(e => {
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      this.setData({
        loading: false
      })
    })
    if (result.code === 0) {
      // wx.showToast({
      //   title: "提交成功！",
      //   icon: "success"
      // })
      this.setData({
        loading: false,
        modalName: "wechat",
        submitFlag: true,
        wechat: wechat,
        repairman: repairman,
        nickName: nickName,
        avatarUrl: avatarUrl
      })
    } else {
      wx.showToast({
        title: '提交失败',
        icon: "none"
      })
      this.setData({
        loading: false
      })
    }
  },
  initValidate: function() {
    let rules = {
      userName: {
        required: true,
        maxlength: 10
      },
      userPhone: {
        required: true,
        tel: true
      },
      userWechat: {
        required: true
      },
      repairmanIndex: {
        required: true
      },
      faultDetail: {
        required: true
      }

    }
    let message = {
      userName: {
        required: "请输入姓名",
        maxlength: "名字不能超过10个字"
      },
      userPhone: {
        required: "请输入手机号码",
        tel: "请输入11位手机号码"
      },
      userWechat: {
        required: "请输入联系微信"
      },
      repairmanIndex: {
        required: "请选择维修人员"
      },
      faultDetail: {
        required: "请描述故障"
      }
    }
    this.WxValidate = new WxValidate(rules, message)
  },
  faultTypeChange: function(e) {
    if (e.currentTarget.dataset.index == this.data.faultTypeCurIndex) {
      return
    }
    var cur = "faultType[" + e.currentTarget.dataset.index + "].checked"
    var pre = "faultType[" + this.data.faultTypeCurIndex + "].checked"
    console.log(cur, pre)
    this.setData({
      [cur]: true,
      [pre]: false,
      faultTypeCurIndex: e.currentTarget.dataset.index
    })
  },
  repairTypeChange: function(e) {
    if (e.currentTarget.dataset.index == this.data.repairTypeCurIndex) {
      return
    }
    var cur = "repairType[" + e.currentTarget.dataset.index + "].checked"
    var pre = "repairType[" + this.data.repairTypeCurIndex + "].checked"
    console.log(cur, pre)
    this.setData({
      [cur]: true,
      [pre]: false,
      repairTypeCurIndex: e.currentTarget.dataset.index
    })
  },
  repairmanChange: function(e) {
    if (e.currentTarget.dataset.index == this.data.repairmanCurIndex) {
      return
    }
    var cur = "repairmanArray[" + e.currentTarget.dataset.index + "].checked"
    var pre = "repairmanArray[" + this.data.repairmanCurIndex + "].checked"
    console.log(cur, pre)
    this.setData({
      [cur]: true,
      [pre]: false,
      repairmanCurIndex: e.currentTarget.dataset.index
    })
  },
  computerTypeChange: function(e) {
    if (e.currentTarget.dataset.index == this.data.computerTypeCurIndex) {
      return
    }
    var cur = "computerType[" + e.currentTarget.dataset.index + "].checked"
    var pre = "computerType[" + this.data.computerTypeCurIndex + "].checked"
    console.log(cur, pre)
    this.setData({
      [cur]: true,
      [pre]: false,
      computerTypeCurIndex: e.currentTarget.dataset.index
    })
  },
  hideModal: function(e) {
    this.setData({
      detailMsg: "请详细描述故障以便我们提供更好的帮助",
      modalName: null
    })
  },
  getUserInfo: async function(e) {
    console.log(e)
    if (!!e.detail.userInfo) {
      wx.showLoading({
        title: '请稍后',
        mask: true
      })
      app.globalData.userInfo = e.detail.userInfo
      const {nickName, gender, avatarUrl} = e.detail.userInfo
      // identity = 1
      if (app.globalData.identity >= 1) {
        //更新
        const {result} = await wx.cloud.callFunction({
          name: "usersHelper",
          data: {
            action: "updateUserInfo",
            nickName, gender, avatarUrl
          }
        }).catch(e => {
          wx.showToast({
            title: '网络错误',
            icon: "none"
          })
          return
        })
        if (result.code == 0) {
          wx.showToast({
            title: '更新成功',
            icon: "success"
          })
          this.setData({
            modalName: null,
            identity: app.globalData.identity,
            detailMsg: "请详细描述故障以便我们提供更好的帮助"
          })
        }
      } else {
        //注册
        const {result} = await wx.cloud.callFunction({
          name: "usersHelper",
          data: {
            action: "register",
            nickName, gender, avatarUrl
          }
        }).catch(e => {
          wx.showToast({
            title: '网络错误',
            icon: "none"
          })
        })
        if (result.code == 0) {
          app.globalData.identity = 1
          wx.showToast({
            title: '获取成功',
            icon: "success"
          })
          this.setData({
            identity: 1,
            modalName: null,
            detailMsg: "请详细描述故障以便我们提供更好的帮助"
          })
        } else {
          wx.showToast({
            title: '请求错误',
            icon: "none"
          })
        }
      }
    } else {
      this.setData({
        
        modalName: null,
        detailMsg: "请详细描述故障以便我们提供更好的帮助"
      })
      wx.showToast({
        title: '授权失败',
        icon: "none"
      })
    }
    // app.globalData.userInfo = e.detail.userInfo
  },
  copyData(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.data,
      success: res => {
        wx.showToast({
          title: '已复制',
        })
      }
    })
  },
  showSubMsg: async function(e) {
    var tmplId = "VNFzvWf4iAIv_K1uaJn61lQ8XWH4wQmU31PXcyXRgmI"
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      success: res => {
        console.log(res)
        if (res[tmplId] == "accept") {
          wx.showToast({
            title: '订阅成功',
            icon: "success"
          })
        } else {
          wx.showToast({
            title: '订阅失败',
            icon: "success"
          })
        }
      },
      fail: e => {
        console.log(e)
        wx.showToast({
          title: '订阅错误',
          icon: "none"
        })
      }
    })
    this.setData({
      detailMsg: "请详细描述故障以便我们提供更好的帮助",
      modalName: null
    })
  }
})