// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  //env: "dist-3gfsowkhc324384b"
  // env: "demo-vr23l"
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const collection = db.collection("repairSheet")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && repairSheetHelper[event.action]) {
    const result = await repairSheetHelper[event.action](event, wxContext)
    return result
  } else {
    return {
      code: -1,
      message: "invalid action"
    }
  }
}
const repairSheetHelper = {
  async postSheet(event, wxContext) {
    const {userName, userPhone, userAddress, userWechat, computerType, repairType, faultType, faultDetail, repairman, repairmanId, userAvatarUrl, email, identity, wechat} = event
    var {nickName} = event
    if (nickName == repairman) {
      nickName = null
    }
    const userId = wxContext.OPENID
    console.log(userId)
    const sheet = await collection.add({
      data: {
        userId,
        createdTime: db.serverDate(),
        userName, userPhone, userAddress, userWechat, computerType, repairType, faultType, faultDetail, repairman, repairmanId, userAvatarUrl, nickName, wechat,
        state: 0,
        isTransfered: false
      }
    })
    const messageCollection = db.collection("message")
    await messageCollection.add({
      data: {
        type: "报单管理",
        senderId: userId,
        senderName: userName,
        senderAvatarUrl: userAvatarUrl,
        receiverId: repairmanId, //ohEs75F8NLbXwdhLd4TMuW414WHY
        receiverName: repairman,
        sentTime: db.serverDate(),
        read: false,
        message: "【" + userName + "】同学需要你的帮助，快去接单吧！",
        sheetId: sheet._id
      }
    })
    try {
      var nodemailer = require("nodemailer")
      var config = {
        host: 'smtp.163.com',
        port: 25,
        auth: {
          user: "taneipc@163.com",
          pass: "TN123456"
        }
      }
      var transporter = nodemailer.createTransport(config)
      var mail = {
        from: "塔内计协小程序 <taneipc@163.com>",
        subject: "您好，"+repairman + "，【" + userName + "】同学需要你的帮助~",
        to: email,
        text: "详细报单请到塔内小程序查看，快去接单吧！（本邮件由塔内计协小程序自动发送）"
      }
      console.log(mail, identity)
      transporter.sendMail(mail)
      if (identity == "干事") {
        const adminCollection = db.collection("admin")
        const adminArray = (await adminCollection
          .where({
            id: 1,
            identity: "部长"
          })
          .get()
        ).data
        if (!!adminArray) {
          if (adminArray.length > 1) {
            var cc = ""
            for (let i = 1; i < adminArray.length; i++) {
              cc += adminArray[i].email + ","
            }
            var mail2 = {
              from: "塔内计协小程序 <taneipc@163.com>",
              subject: "技术部部长，您好！【" + repairman + "】接到新的报单啦~",
              to: adminArray[0].email,
              text: "详细报单请到塔内小程序查看，快去通知Ta吧！（本邮件由塔内计协小程序自动发送）",
              cc: cc
            }
            transporter.sendMail(mail2)
            console.log(mail2)
          } else {
            var mail2 = {
              from: "塔内计协小程序 <taneipc@163.com>",
              subject: "技术部部长，您好！【" + repairman + "】接到新的报单啦~",
              to: adminArray[0].email,
              text: "详细报单请到塔内小程序查看，快去通知Ta吧！（本邮件由塔内计协小程序自动发送）"
            }
            transporter.sendMail(mail2)
            console.log(mail2)
            }
        }
      }
    } catch(e) {
      console.error(e)
    }
    return {
      code: 0,
      message: "postSheet successfully",
    }
    
  },
  // async test(event, wxContext) {
  //   var nodemailer = require("nodemailer")
  //   var config = {
  //     host: 'smtp.163.com',
  //     port: 25,
  //     auth: {
  //       user: "taneipc@163.com",
  //       pass: "TN123456"
  //     }
  //   }
  //   var repairman = "小鸡"
  //   var userName = "test"
  //   var transporter = nodemailer.createTransport(config)
  //   var mail = {
  //     from: "塔内计协小程序 <taneipc@163.com>",
  //     subject: "您好，"+repairman + "，【" + userName + "】同学需要你的帮助~",
  //     to: "xiaoji_owo@qq.com",
  //     text: "详细报单请到塔内小程序查看，快去接单吧！（本邮件由塔内计协小程序自动发送）"
  //   }
  //   transporter.sendMail(mail)
  //   const adminCollection = db.collection("admin")
  //   const adminArray = (await adminCollection
  //     .where({
  //       id: 1,
  //       identity: "部长"
  //     })
  //     .get()
  //   ).data
  //   // console.log(adminArray)
  //   if (!!adminArray) {
  //     var cc = ""
  //     for (let i = 1; i < adminArray.length; i++) {
  //       cc += adminArray[i].email + ","
  //     }
  //     var mail2 = {
  //       from: "塔内计协小程序 <taneipc@163.com>",
  //       subject: "技术部部长，您好！【" + repairman + "】接到新的报单啦~",
  //       to: adminArray[0].email,
  //       text: "详细报单请到塔内小程序查看，快去通知Ta吧！（本邮件由塔内计协小程序自动发送）",
  //       cc: cc
  //     }
  //     console.log(adminArray[0].email, cc)
  //     transporter.sendMail(mail2)
  //   }
  //   return
  // },
  async receive(event, wxContext) { //传入_id
    await collection.doc(event._id).update({
      data: {
        state: 1,
        receiveTime: db.serverDate(),
        receiveBy: wxContext.OPENID
      }
    })
    const messageCollection = db.collection("message")
    const [message] = (await messageCollection
      .where({
        sheetId: event._id,
        type: "报单管理",
        read: false
      })
      .get()
    ).data
    if (!!message) {
      await messageCollection.doc(message._id).update({
        data: {
          read: true,
          receivedTime: db.serverDate()
        }
      })
    }
    return {
      code: 0,
      message: "receive successfully"
    }
  },
  async cancel(event, wxContext) {
    await collection.doc(event._id).update({
      data: {
        state: -1,
        cancelBy: wxContext.OPENID,
        cancelTime: db.serverDate()
      }
    })
    const messageCollection = db.collection("message")
    const [message] = (await messageCollection
      .where({
        sheetId: event._id,
        type: "报单管理",
        read: false
      })
      .get()
    ).data
    if (!!message) {
      await messageCollection.doc(message._id).update({
        data: {
          read: true,
          receivedTime: db.serverDate()
        }
      })
    }
    return {
      code: 0,
      message: "ok"
    }
  },
  async complete(event, wxContext) {
    const sheet = (await collection.doc(event._id).get()).data
    if (!sheet) {
      return {
        code: 1,
        message: "报单不存在"
      }
    }
    const {avatarUrl} = event
    var completeTime = new Date()
    let temp = new Date(completeTime.getTime() + 8*60*60*1000).toISOString().split("T")
    let completeTime_S = temp[0] + " " + temp[1].split(".")[0]
    console.log(completeTime_S)
    await collection.doc(event._id).update({
      data: {
        state: 2,
        completeTime: completeTime,
        completeBy: wxContext.OPENID
      }
    })
    const messageCollection = db.collection("message")
    const result = await messageCollection.add({
      data: {
        type: "报单评价",
        senderId: wxContext.OPENID,
        senderName: sheet.repairman,
        senderAvatarUrl: avatarUrl,
        read: false,
        message: "你的报单已完成，快去评价一下吧！",
        receiverId: sheet.userId,
        receiverName: sheet.userName,
        nickName: sheet.nickName,
        sentTime: db.serverDate(),
        sheetId: sheet._id
      }
    })
    if (result.errMsg == "collection.add:ok") {
      try {
        await cloud.openapi.subscribeMessage.send({
          touser: sheet.userId,
          templateId: "VNFzvWf4iAIv_K1uaJn61lQ8XWH4wQmU31PXcyXRgmI",
          page: "/pages/aboutPage/myRepairSheet/myRepairSheet",
          data: {
            "thing9": {
              "value": "已完成"
            },
            "thing5": {
              "value": "你的反馈对我们非常重要，快去评价一下吧～"
            },
            "date4": {
              "value": completeTime_S
            }
          }
        })
        return {
          code: 0,
          message: "complete successfully"
        }
      } catch (e) {
        console.log(e)
        return {
          code: 1,
          message: "add error"
        }
      }
    } else {
      return {
        code: 1,
        message: "add error"
      }
    }
  },
  async postFeedback(event, wxContext) {
    const {feedback, score} = event
    await collection.doc(event._id).update({
      data: {
        feedback,
        score,
        state: 3,
        feedbackTime: db.serverDate()
      }
    })
    const messageCollection = db.collection("message")
    const [message] = (await messageCollection
      .where({
        sheetId: event._id,
        type: "报单评价",
        read: false
      })
      .get()
    ).data
    if (!!message) {
      await messageCollection.doc(message._id).update({
        data: {
          read: true,
          receivedTime: db.serverDate()
        }
      })
    }
    return {
      code: 0,
      message: "post successfully"
    }
  },
  async postSummary(event, wxContext) {
    const {summary} = event
    await collection.doc(event._id).update({
      data: {
        summary,
        summaryTime: db.serverDate()
      }
    })
    return {
      code: 0,
      message: "post successfully"
    }
  },
  async getMySheets(event, wxContext) {
    // const {pageSize} = event
    // console.log(pageSize, wxContext.OPENID)
    const total = (await collection
      .where({
        userId: wxContext.OPENID
      })
      .count()
    ).total
    const sheets = (await collection
      .where({
        userId: wxContext.OPENID
      })
      .orderBy("createdTime", "desc")
      // .limit(pageSize)
      .get()
    ).data
    var mySheets = []
    for (let i = 0; i < sheets.length; i++) {
      let sheet = {
        _id: sheets[i]._id,
        createdTime: sheets[i].createdTime,
        state: sheets[i].state,
        userName: sheets[i].userName,
        userAvatarUrl: sheets[i].userAvatarUrl,
        computerType: sheets[i].computerType,
        faultType: sheets[i].faultType,
        repairType: sheets[i].repairType,
        feedback: sheets[i].feedback,
        score: sheets[i].score
      }
      mySheets.push(sheet)
    }
    return {
      code: 0,
      message: "ok",
      total,
      mySheets
    }
  },
  async getDetailSheet(event, wxContext) {
    const sheet = (await collection.doc(event.sheetId).get()).data
    return {
      code: 0,
      message: "ok",
      sheet
    }
  },
  async getRepairmanSheets(event, wxContext) {
    // const {pageSize} = event
    const total = (await collection
      .where({
        repairmanId: wxContext.OPENID,
        state: _.and(_.neq(0), _.neq(1))
      })
      .count()
    ).total
    const ingSheets = (await collection
      .where({
        repairmanId: wxContext.OPENID,
        state: _.or(_.eq(0), _.eq(1))
      })
      .orderBy("createdTime", "desc")
      .get()
    ).data
    const sheets = (await collection
      .where({
        repairmanId: wxContext.OPENID,
        state: _.and(_.neq(0), _.neq(1))
      })
      .orderBy("createdTime", "desc")
      .get()
    ).data
    var completedSheets = []
    for (let i = 0; i < sheets.length; i++) {
      let sheet = {
        _id: sheets[i]._id,
        createdTime: sheets[i].createdTime,
        state: sheets[i].state,
        userName: sheets[i].userName,
        userAvatarUrl: sheets[i].userAvatarUrl,
        computerType: sheets[i].computerType,
        faultType: sheets[i].faultType,
        repairType: sheets[i].repairType,
        summary: sheets[i].summary
      }
      completedSheets.push(sheet)
    }
    return {
      code: 0,
      total,
      ingSheets,
      completedSheets
    }
  },
  async getAllSheets (event, wxContext) {
    const ingSheets = (await collection
      .where({
        state: _.or(_.eq(0), _.eq(1))
      })
      .orderBy("createdTime", "desc")
      .get()
    ).data
    const sheets = (await collection
      .where({
        state: _.and(_.neq(0), _.neq(1))
      })
      .orderBy("createdTime", "desc")
      .get()
    ).data
    var completedSheets = []
    for (let i = 0; i < sheets.length; i++) {
      let sheet = {
        _id: sheets[i]._id,
        createdTime: sheets[i].createdTime,
        state: sheets[i].state,
        userName: sheets[i].userName,
        userAvatarUrl: sheets[i].userAvatarUrl,
        computerType: sheets[i].computerType,
        faultType: sheets[i].faultType,
        repairType: sheets[i].repairType,
        repairman: sheets[i].repairman,
        nickName: sheets[i].nickName
      }
      completedSheets.push(sheet)
    }
    return {
      code: 0,
      ingSheets,
      completedSheets
    }
  },
  async getStatistics(event, wxContext) {
    const ingNum = (await collection
      .where({
        state: _.or(_.eq(0), _.eq(1))
      })
      .count()
    ).total
    const totalNum = (await collection.count()).total

    const sheets = (await collection
      .where({
        state: _.and(_.neq(0), _.neq(1), _.neq(-1))
      })
      .get()
    ).data
    const completedNum = sheets.length
    var completed1 = 0
    var completed3 = 0
    var completed7 = 0
    for (let i = 0; i < sheets.length; i++) {
      let msecNum = new Date(sheets[i].completeTime).getTime() - new Date(sheets[i].createdTime).getTime()
      // console.log(msecNum, sheets[i].createdTime, sheets[i].completeTime)
      if (msecNum <= 86400000 * 7) {
        completed7 += 1
        if (msecNum <= 86400000 * 3) {
          completed3 += 1
          if (msecNum <= 86400000) {
            completed1 += 1
          }
        }
      }
    }
    // const adminCollection = db.collection("admin")
    // const adminArray = (await adminCollection
    //   .where({
    //     id: 1,
    //     department: "技术部"
    //   })
    //   .get()
    // ).data
    // var adminArray2 = []
    // var adminArray34 = []
    // var adminArray5 = []
    // for (let i = 0; i < adminArray.length; i++) {
    //   let cNum = (await collection
    //     .where({
    //       repairmanId: adminArray[i].openId,
    //       state: _.and(_.neq(0), _.neq(1), _.neq(-1))
    //     })
    //     .count()
    //   ).total
    //   if (adminArray[i].identity == "干事") {
    //     adminArray2.push({
    //       name: adminArray[i].name,
    //       nickName: adminArray[i].nickName,
    //       completedNum: cNum
    //     })
    //   }
    //   if (adminArray[i].identity == "部长" || adminArray[i].identity == "会长") {
    //     adminArray34.push({
    //       name: adminArray[i].name,
    //       nickName: adminArray[i].nickName,
    //       completedNum: cNum
    //     })
    //   }
    //   if (adminArray[i].identity == "老人" || adminArray[i].identity == "SA") {
    //     adminArray5.push({
    //       name: adminArray[i].name,
    //       nickName: adminArray[i].nickName,
    //       completedNum: cNum
    //     })
    //   }
    // }
    return {
      code: 0,
      ingNum, completedNum, totalNum, completed1, completed3, completed7,
      // adminArray2, adminArray34, adminArray5
    }
  },
  async getAdminStatistics2(event, wxContext) {
    const adminCollection = db.collection("admin")
    const adminArray = (await adminCollection
      .where({
        id: 1,
        department: "技术部"
      })
      .get()
    ).data
    var adminArray2 = []
    var adminArray34 = []
    var adminArray5 = []
    for (let i = 0; i < adminArray.length; i++) {
      let cNum = (await collection
        .where({
          repairmanId: adminArray[i].openId,
          state: _.and(_.neq(0), _.neq(1), _.neq(-1))
        })
        .count()
      ).total
      if (adminArray[i].identity == "干事") {
        adminArray2.push({
          name: adminArray[i].name,
          nickName: adminArray[i].nickName,
          completedNum: cNum
        })
      }
      if (adminArray[i].identity == "部长" || adminArray[i].identity == "会长") {
        adminArray34.push({
          name: adminArray[i].name,
          nickName: adminArray[i].nickName,
          completedNum: cNum
        })
      }
      if (adminArray[i].identity == "老人" || adminArray[i].identity == "SA") {
        adminArray5.push({
          name: adminArray[i].name,
          nickName: adminArray[i].nickName,
          completedNum: cNum
        })
      }
    }
    return {
      code: 0,
      adminArray2, adminArray34, adminArray5
    }
  },
  async getUserFeedback(event, wxContext) {
    const sheets = (await collection
      .where({
        state: 3
      })
      .orderBy("feedbackTime", "desc")
      .get()
    ).data
    var feedback = []
    for (let i = 0; i < sheets.length; i++) {
      feedback.push({
        feedbackTime: sheets[i].feedbackTime,
        score: sheets[i].score,
        feedback: sheets[i].feedback,
        repairman: sheets[i].repairman,
        nickName: sheets[i].nickName,
        avatarUrl: sheets[i].userAvatarUrl,
        userName: "用户" + sheets[i].userId.slice(sheets[i].userId.length - 5)
      })
    }
    return {
      code: 0,
      feedback
    }
  },
  async getAdminStatistics(event, wxContext) {
    const adminCollection = db.collection("admin")
    const adminArray = (await adminCollection
      .where({
        id: 1,
        department: "技术部",
        identity: _.or(_.eq("部长"), _.eq("干事"), _.eq("会长"))
      })
      .get()
    ).data
    var adminStatistics = []
    for (let i = 0; i < adminArray.length; i++) {
      let cNum = (await collection
        .where({
          repairmanId: adminArray[i].openId,
          state: _.and(_.neq(0), _.neq(1), _.neq(-1))
        })
        .count()
      ).total
      adminStatistics.push({
        name: adminArray[i].name,
        nickName: adminArray[i].nickName,
        completedNum: cNum
      })
    }
    adminStatistics.sort((a, b) => {
      return b.completedNum - a.completedNum
    })
    return {
      code: 0,
      adminStatistics
    }
  },
}