import WxValidate from "../../../utils/WxValidate"
const app = getApp()
Page({
  data: {
    loading: false,
    repairTypeCurIndex: 0,
    repairType: [
      {
        name: "线上咨询",
        checked: true
      }, {
        name: "送修"
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
    repairmanCurIndex: 0,
    repairmanArray: null,
    submitFlag: false,
    isLoad: false,
    identity: 0,
    detailMsg: "请详细描述故障以便我们提供更好的帮助",
    modalName: null,
    sec: 5,
  },
  onLoad: async function (options) {
    // 注意事项
    this.setData({
      modalName: 'showAttention'
    });
    let that = this;
    function countdown(){
      that.setData({
        sec: that.data.sec-1
      });
      if(that.data.sec > 0) {
        setTimeout(countdown, 1000);
      }
    }
    setTimeout(countdown, 1500)

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
      })
      return
    }
    this.setData({
      submitFlag: true
    })
    console.log("submit", e.detail)
    let params = e.detail.value
    if (!this.WxValidate.checkForm(params)) {
      let error = this.WxValidate.errorList[0]
      wx.showToast({
        title: error.msg,
        icon: "none"
      })
      this.setData({
        submitFlag: false
      })
      return false
    } else {
      console.log("ok")
    }
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
        submitFlag: false,
        loading: false
      })
    })
    if (result.code === 0) {
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
        submitFlag: false,
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
  getUserInfo: async function() {
    const result = await wx.getUserProfile({
      desc: "获取用户信息"
    }).catch(e => {
      wx.showToast({
        title: '获取失败',
        icon: "none"
      })
      return
    })
    if (!!result) {
      app.globalData.userInfo = result.userInfo
      wx.showLoading({
        title: '请稍后',
        mask: true
      })
      app.globalData.userInfo = result.userInfo
      const {nickName, avatarUrl} = result.userInfo
      // identity = 1
      if (app.globalData.identity >= 1) {
        //更新
        const {result} = await wx.cloud.callFunction({
          name: "usersHelper",
          data: {
            action: "updateUserInfo",
            nickName, avatarUrl
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
          app.globalData.userInfo.avatarUrl = result.avatarUrl
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
            nickName, avatarUrl
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
          app.globalData.userInfo.avatarUrl = result.avatarUrl
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
  },
  hideModal: function () {
    if (this.data.sec > 0)
      return
    this.setData({
      modalName: null
    })
  },
  backToHome: function () {
    wx.navigateBack()
  }
})