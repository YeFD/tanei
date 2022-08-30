// pages/homePage/package/QASystem.js
const app = getApp()
Page({
  data: {
    inputBottom: 0,
    messages: [],
    avatarUrl: "https://6469-dist-3gfsowkhc324384b-1259081600.tcb.qcloud.la/image/defaultAvatar.jpg",
    botAvatarUrl: "https://6469-dist-3gfsowkhc324384b-1259081600.tcb.qcloud.la/image/defaultAvatar.jpg",
    curQuestion: "",
    queryUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {result} = await wx.cloud.callFunction({
      name: "statisticsHelper",
      data: {
        action: "getQASystemInfo",
      }
    }).catch(e => {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    if (result.code === 0 && result.queryFlag) {
      this.setData({
        isLoad: true,
        queryUrl: result.queryUrl,
        messages: [
          {
            isSelf: false,
            message: "猜你想问（回复数字）：",
            date: this.getDate(),
            otherQuestions: result.questions
          }
        ],
        avatarUrl: app.globalData.userInfo.avatarUrl,
      })
    } else {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
    }
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  inputQuestion: function(e) {
    this.setData({
      curQuestion: e.detail.value
    })
  },
  tapQuestion: async function(e) {
    console.log(111)
  },
  tapSubmit: async function(e) {
    let question = this.data.curQuestion
    if (!this.data.messages[this.data.messages.length-1].isSelf) {
      for (let i = 1; i < this.data.messages[this.data.messages.length-1].otherQuestions.length+1; i++) {
        if (question == i) {
          question = this.data.messages[this.data.messages.length-1].otherQuestions[i-1]
        }
      }
    }
    if (question.length < 4) {
      wx.showToast({
        title: '问题输入太短啦',
        icon: "none"
      })
      return
    }
    this.setData({
      curQuestion: ""
    })
    await this.submit(question)
  },
  submit: async function(question) {
    let messages = this.data.messages
    messages.push({
      isSelf: true,
      message: question,
      date: this.getDate(),
      cost: "",
    })
    this.setData({
      isLoad: false,
      messages
    })
    wx.pageScrollTo({
      scrollTop: 9999,
    })
    var questions, cost
    var reqTime = 0; //记录请求次数
    const request = (params) => {
        reqTime++;
        //返回
        return new Promise((resolve, reject) => {
            wx.request({
                //解构params获取请求参数
                ...params,
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                },
                complete: () => {
                    reqTime--;
                    //停止加载
                }
            });
        });
    }
    let url = "https://nlp.xiaoji.icu/query_api/"
    const res = await request({
      url: url,
      method: "POST",
      data: {
        question
      },
    }).catch(e => {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '服务器错误',
        icon: "none"
      })
      return
    })

    if (!res.data.questions) {
      wx.showToast({
        title: '分析服务器错误',
        icon: "none"
      })
      return
    }
    questions = res.data.questions
    cost = res.data.cost
    console.log(questions, cost)
    const {result} = await wx.cloud.callFunction({
      name: "statisticsHelper",
      data: {
        action: "getAnwser",
        question: questions[0][0]
      }
    }).catch(e => {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '网络错误',
        icon: "none"
      })
      return
    })
    console.log(result)
    if (result.code === 0) {
      let anwser = result.anwser.anwser
      let otherQuestions = []
      for (let i=1; i<questions.length; i++) {
        otherQuestions.push(questions[i][0])
      }
      function toPercent(point){
        var str=Number(point*100).toFixed();
        str+="%";
        return str;
      }
      messages.push({
        isSelf: false,
        question: questions[0][0],
        similarity: toPercent(questions[0][1]),
        message: anwser + "\n\n猜你想问（回复数字）：",
        date: this.getDate(),
        cost: Math.ceil(cost*1000) + "ms",
        otherQuestions
      })
      this.setData({
        messages
      })
      wx.pageScrollTo({
        scrollTop: 9999,
      })
    } else {
      wx.showToast({
        title: '服务器失效',
        icon: "none"
      })
    }
    this.setData({
      isLoad: true
    })
  },
  getDate: function() {
    let curTime = new Date(new Date().getTime() + 8*60*60*1000).toISOString()
    let temp = curTime.split("T")
    return temp[0] + " " + temp[1].split(".")[0]
  }
})