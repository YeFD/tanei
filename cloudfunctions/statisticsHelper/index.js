// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request')
cloud.init({
  //env: "dist-3gfsowkhc324384b"
  // env: "demo-vr23l"
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const collection = db.collection("statistics")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && statisticsHelper[event.action]) {
    const result = await statisticsHelper[event.action](event, wxContext)
    return result
  } else {
    return {
      code: -1,
      message: "invalid action"
    }
  }
}
const statisticsHelper = {
  async init(event, wxContext) {
    const [data] = (await collection
      .where({
        id: 0
      })
      .get()
    ).data
    if (!!data) {
      return {
        code: 1,
        message: "inited"
      }
    } else {
      await collection.add({
        data: {
          id: 0,
          createdBy: wxContext.OPENID,
          createdTime: db.serverDate(),
          updatedBy: wxContext.OPENID,
          updatedTime: db.serverDate(),
          totalVisitors: 1
        }
      })
      return {
        code: 0,
        message: "init successfully"
      }
    }
  },
  async visit(event, wxContext) {
    const [data] = (await collection
      .where({
        id: 0
      })
      .get()
    ).data
    if (!!data) {
      await collection.doc(data._id).update({
        data: {
          updatedTime: db.serverDate(),
          updatedBy: wxContext.OPENID,
          totalVisitors: Number(data.totalVisitors + 1),
        }
      })
      return {
        code: 0,
        message: "ok"
      }
    } else {
      return {
        code: 1,
        message: "not inited"
      }
    }
  },
  async getStatistics(event, wxContext) {
    const [data] = (await collection
      .where({
        id: 0
      })
      .get()
    ).data
    const usersCollection = db.collection("users")
    const userNum = (await usersCollection.count()).total
    console.log(userNum)
    if (!!data) {
      return {
        code: 0,
        message: "get successfully",
        total: data.totalVisitors,
        userNum
      }
    } else {
      return {
        code: 1,
        message: "not inited"
      }
    }
  },
  async getParsingUrl(event, wxContext) {
    const [data] = (await collection
      .where({
        id: 1
      })
      .get()
    ).data
    if (data.parsingFlag) {
      return {
        code: 0,
        url: data.parsingUrl
      }
    } else {
      return {
        code: 1
      }
    }
  },
  async getTokenUrl(event, wxContext) {
    const [data] = (await collection
      .where({
        id: 1
      })
      .get()
    ).data
    const {APIKey, SecretKey} = data
    var tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${APIKey}&client_secret=${SecretKey}`
    console.log(tokenUrl)
    return {
      code: 0,
      tokenUrl: tokenUrl
    }
  },
  async updateToken(event, wxContext) {
    const {token} = wxContext
  },
  async getReportUrl(event, wxContext) {
    const [data] = (await collection
      .where({
        id: 1
      })
      .get()
    ).data
    if (!data.reportFlag) {
      return {
        code: 1,
        message: "还未开放"
      }
    }
    var url = `https://aip.baidubce.com/rpc/2.0/nlp/v2/comment_tag?access_token=${data.token}&charset=UTF-8`
    return {
      code: 0,
      url: url
    }
  },
  async getReportData(event, wxContext) {
    var collection2 = db.collection("repairSheet")
    const sheets = (await collection2
      .where({
        state: 3,
        repairmanId: wxContext.OPENID,
      })
      .get()
    ).data
    var feedback = ""
    for (let i = 0; i < sheets.length; i++) {
      feedback += sheets[i].feedback + " "
    }
    const sheets2 = (await collection2
      .where({
        repairmanId: wxContext.OPENID,
        state: _.and(_.neq(0), _.neq(1), _.neq(-1))
      })
      .get()
    ).data
    var minTime = 86400000
    for (let i = 0; i < sheets2.length; i++) {
      let t = sheets2[i].completeTime- sheets2[i].createdTime
      if (t < minTime) {
        minTime = t
      }
    }
    let hour = Math.floor(minTime / 3600000)
    let minute = Math.floor(minTime / 60000)
    let second = Math.floor(minTime / 1000)
    return {
      code: 0,
      feedback, hour, minute, second
    }
  },
  async getQASystemInfo(event, wxContext) {
    const [data] = (await collection
      .where({
        id: 1
      })
      .get()
    ).data
    const dataset = db.collection("dataset")
    const num = (await dataset
      .count()
    ).total
    function randomNums(n, min, max) {
      var arr = [];
      for (i = 0; i < n; i++) {
        var ran = Math.floor(Math.random() * (max - min + 1) + min);
        while (isExist(arr, ran)) {
          ran = Math.floor(Math.random() * (max - min + 1) + min);
        }
        arr[i] = ran;
      }
      return arr;
    }
    function isExist(arr, ran) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == ran) {
          return true;
        }
      }
      return false;
    }
    let ids = randomNums(5, 0, num-1)
    questions = []
    for(let i=0; i<5; i++) {
      const {data} = (await dataset.doc(ids[i]).get())
      // console.log(ids[i], data)
      questions.push(data.question)
    }
    return {
      code: 0,
      queryFlag: data.parsingFlag,
      queryUrl: data.queryUrl,
      queryTimes: data.queryTimes,
      questions
    }

  },
  async getAnwser(event, wxContext) {
    const [data] = (await collection
      .where({
        id: 1
      })
      .get()
    ).data
    await collection.doc(data._id).update({
      data: {
        updatedTime: db.serverDate(),
        updatedBy: wxContext.OPENID,
        queryTimes: Number(data.queryTimes + 1),
      }
    })
    const {question} = event
    const dataset = db.collection("dataset")
    const [anwser] = (await dataset
      .where({
        question
      }).get()
    ).data
    return {code: 0, anwser}
  }
}