// miniprogram/pages/aboutPage/package1/nlp/nlp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    sentence: "",
    type: "陈述句",
    parse: [
      {word: "本", flag: "代词", syntax: "主语", color: "blue"},
      {word: "页面", flag: "名词", syntax: "主语", color: "blue"},
      {word: "可以", flag: "动词", syntax: "谓语", color: "olive"},
      {word: "处理", flag: "动词", syntax: "谓语", color: "olive"},
      {word: "简单", flag: "形容词", syntax: "定语", color: "cyan"},
      {word: "的", flag: "的", syntax: "定语", color: "cyan"},
      {word: "中文", flag: "名词", syntax: "宾语", color: "mauve"},
      {word: "分词", flag: "名词", syntax: "宾语", color: "mauve"},
      {word: "和", flag: "并列连词", syntax: "宾语", color: "mauve"},
      {word: "语句", flag: "名词", syntax: "宾语", color: "mauve"},
      {word: "分析", flag: "名词", syntax: "宾语", color: "mauve"},
    ],
    syntax: ["主语", "谓语", "定语", "宾语"],
    syntaxStyle: {
      "主语": {
        color: "blue",
        type: "bg"
      },
      "谓语": {
        color: "olive",
        type: "bg"
      },
      "宾语": {
        color: "mauve",
        type: "bg"
      },
      "定语": {
        color: "cyan",
        type: "line"
      },
      "状语": {
        color: "cyan",
        type: "line"
      },
      "祈使词": {
        color: "grey",
        type: "bg"
      },
      "补语": {
        color: "grey",
        type: "bg"
      },
      "把词": {
        color: "olive",
        type: "bg"
      },
      "疑问词": {
        color: "grey",
        type: "bg"
      },
      "被词": {
        color: "olive",
        type: "bg"
      },
      "助词": {
        color: "blue",
        type: "bg"
      },
      "符号": {
        color: "grey",
        type: "bg"
      },
      "未知": {
        color: "pink",
        type: "bg"
      },
    },
    curIndex: 0,
    sample: [
      {
              sentence: "请各位读者朋友将所有个人物品带走",
              extra_word: "",
              extra_flag: "名词",
              message: "把式祈使句",
          }, {
              sentence: "请好心的你帮帮可怜的我吧",
              extra_word: "",
              extra_flag: "名词",
              message: "普通祈使句",
          }, {
              sentence: "我的专业是计算机科学与技术",
              extra_word: "计算机科学与技术",
              extra_flag: "名词",
              message: "补充“计算机科学与技术”为名词",
          }, {
              sentence: "小明成为了一名华南师范大学的学生",
              extra_word: "华南师范大学",
              extra_flag: "名词",
              message: "补充“华南师范大学”为名词",
          }, {
              sentence: "小明和小红都喜欢打篮球",
              extra_word: "",
              extra_flag: "名词",
              message: "主语带连词",
          }, {
              sentence: "中国对外经济技术合作不断扩大",
              extra_word: "",
              extra_flag: "名词",
              message: "主谓结构（无宾语）",
          }, {
              sentence: "追寻人生的价值和意义",
              extra_word: "",
              extra_flag: "名词",
              message: "谓宾结构（无主语）",
          }, {
              sentence: "我把电脑修好了",
              extra_word: "",
              extra_flag: "名词",
              message: "把字陈述句",
          }, {
              sentence: "电脑被我修好了",
              extra_word: "",
              extra_flag: "名词",
              message: "被式陈述句",
          }, {
              sentence: "新建的博物馆里整齐地摆设了许多精美的名画和瓷器",
              extra_word: "",
              extra_flag: "名词",
              message: "长陈述句",
          }, {
              sentence: "你喜欢喝牛奶吗？",
              extra_word: "",
              extra_flag: "名词",
              message: "普通疑问句",
          }, {
              sentence: "小明是否将小鸟吓跑了？",
              extra_word: "",
              extra_flag: "名词",
              message: "把式疑问句",
          }, {
              sentence: "定海神针是否被那齐天大圣抢走了？",
              extra_word: "",
              extra_flag: "名词",
              message: "被动+是否",
          }, {
              sentence: "你是否真的喜欢她？",
              extra_word: "",
              extra_flag: "名词",
              message: "是否疑问句",
          }, 
      ],
    arr: [],
    curSample: -1,
    extraList: ["名词", "形容词", "副词", "动词"],
    extraFlagList: {
      "名词": "n", "形容词": "adj", "副词": "adv", "动词": "v"
    },
    extraIndex: 0,
    extra_word: "",
    extra_flag: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {result} = await wx.cloud.callFunction({
      name: "statisticsHelper",
      data: {
        action: "getParsingUrl"
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
    if (result.code === 0) {
      this.setData({
        isLoad: true,
        url: result.url
      })
    } else {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '分析服务器已失效',
        icon: "none"
      })
    }
    var arr = []
    for (let j = 0; j < this.data.sample.length; j++) {
        arr.push(j)
    }
    function randomsort(a, b) {
        return Math.random()>.5 ? -1 : 1;
    }
    arr.sort(randomsort);
    this.setData({
      arr: arr,
    })
  },
  tapWord: function (e) {
    const {index} = e.currentTarget.dataset
    this.setData({
      curIndex: index
    })
  },
  tagSyntax: function (e) {
    const {syntax} = e.currentTarget.dataset
    if (syntax == this.data.curSyntax) {
      this.setData({
        curSyntax: ""
      })
    } else {
      this.setData({
        curSyntax: syntax
      })
    }
  },
  tapAnalyze: async function(e) {
    if (this.data.sentence == "") {
      wx.showToast({
        title: '分析文本不能为空',
        icon: "none"
      })
      return
    }
    if (!this.data.isLoad) {
      wx.showToast({
        title: '分析中',
        icon: "none"
      })
      return
    }
    let url = this.data.url
    if (url == "") {
      wx.showToast({
        title: '分析服务器已失效',
        icon: "none"
      })
      return
    }
    this.setData({
      isLoad: false
    })
    // url = "https://gabibg-zuqyyu-8080.preview.myide.io/api/"
    await wx.request({
      url: url,
      method: "POST",
      data: {
        sentence: this.data.sentence,
        extra_word: this.data.extra_word,
        extra_flag: this.data.extraFlagList[this.data.extra_flag]
      },
      success: res => {
        if (!res.data.type) {
          this.setData({
            isLoad: true
          })
          wx.showToast({
            title: '分析服务器错误',
            icon: "none"
          })
          return
        }
        const {words, flags, flags2, type, result, error} = res.data
        var parse = []
        var syntax = []
        for (let i = 0; i < result.length; i++) {
          parse.push({word: words[i], flag: flags2[i], syntax: result[i], color: this.data.syntaxStyle[result[i]].color})
          if (!syntax.includes(result[i])) {
            syntax.push(result[i])
          }
        }
        if (words.length > result.length) {
          syntax.push("未知")
            for (let i = result.length; i < words.length; i++) {
              parse.push({word: words[i], flag: flags2[i], syntax: "未知", color: "pink"})
              // if (!syntax.includes(result[i])) {
              // }
            }
        }
        if (error.length > 0) {
          e = error[0]
          for (let i = 1; i < error.length; i++) {
            e += ", " + error[i]
          }
          if (error != "") {
            wx.showToast({
              title: e,
              icon: "none"
            })
          }
        }
        // console.log(parse)
        this.setData({
          parse, syntax, type,
          isLoad: true,
          curSyntax: "",
          curIndex: 0
        })
      },
      fail: e => {
          this.setData({
            isLoad: true
          })
          wx.showToast({
            title: '服务器错误',
            icon: "none"
          })
          return
      }
    })
  },
  inputSentence: function(e) {
    this.setData({
      sentence: e.detail.value
    })
  },
  inputExtra: function(e) {
    this.setData({
      extra_word: e.detail.value
    })
  },
  tapRandom: function(e) {
    var curSample = (this.data.curSample + 1) % this.data.arr.length
    this.setData({
      curSample: curSample,
      sentence: this.data.sample[this.data.arr[curSample]].sentence,
      extra_word: this.data.sample[this.data.arr[curSample]].extra_word,
      extra_flag: this.data.sample[this.data.arr[curSample]].extra_flag
    })
    // this.uploadAllAvatar()
  },
  changeExtra: function(e) {
    this.setData({
      extraIndex: e.detail.value
    })
  },
  copyData: function(e) {
    wx.setClipboardData({
      data: this.data.url.slice(0, -4),
      success: res => {
        wx.showToast({
          title: '已复制地址',
        })
      }
    })
  },

  async uploadAllAvatar() {
    console.log("begin")
    const {result} = await wx.cloud.callFunction({
      name: "usersHelper",
      data: {
        action: "getAllUser"
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
    if (result.code != 0) {
      console.error("error")
      return
    }
    for (let i = 0; i < result.total; i++) {
      var {_id, openId, avatarUrl, adminId} = result.userArray[i]
      console.log(i, _id, openId, avatarUrl)
      if (!avatarUrl) continue
      const res = await wx.cloud.callFunction({
        name: "usersHelper",
        data: {
          action: "uploadAvatar2",
          _id, openId, avatarUrl, adminId
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
      var result2 = res.result
      if (result2.code != 0) {
        console.error("=======error=======", i)
      } else {
        console.log("|||success||||", result2.avatarUrl)
      }
    }
  }
})