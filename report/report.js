Page({
  data: {
    url: null
  },
  onLoad: async function (options) {
    const {result} = await wx.cloud.callFunction({
      name: "statisticsHelper",
      data: {
        action: "getReportUrl"
      }
    }).catch(e => {
      this.setData({
        isLoad: true,
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
        title: '暂未开放',
        icon: "none"
      })
    }
  },
  getReport: async function(e) {
    const {result} = await wx.cloud.callFunction({
      name: "statisticsHelper",
      data: {
        action: "getReportData"
      }
    }).catch(e => {
      this.setData({
        isLoad: true,
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
        time: `${result.hour}小时${result.minute}分${result.second}秒`
      })
      var feedback = "手艺娴熟精湛，非常满意 服务挺好，提供了解决措施 小伙子真的超棒阿！考虑很周全 非常感谢 都非常耐心阿～～ 销量很高 声音还很有磁性，就是高冷了点 很热心，态度超赞哒，也很专业"
      let keywords = await this.getKeywords(feedback, 3)
      console.log(keywords)
    } else {
      this.setData({
        isLoad: true
      })
      wx.showToast({
        title: '暂未开放',
        icon: "none"
      })
    }
  },
  getKeywords: async function(feedback, type) {
    wx.request({
      url: this.data.url,
      method: "POST",
      data: {
        "text": feedback,
        "type": type
        // 11 7 3 生活 教育 丽人
      },
      success: res => {
        console.log(res.data.items)
        var keywords = []
        for (let i = 0; i < res.data.items.length; i++) {
          let keyword
          if (!!res.data.items[i].adj) {
            keyword = res.data.items[i].adj
          } else {
            keyword = res.data.items[i].prop
          }
          if (!keywords.includes(keyword)) {
            keywords.push(keyword)
          }
        }
        console.log(keywords)
        return keywords
      },
      fail: e => {
        wx.showToast({
          title: '分析服务器错误',
          icon: "none"
        })
        return
      }
    })
  }
})