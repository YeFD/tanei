// 云函数入口文件
const cloud = require('wx-server-sdk')
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
  }
}