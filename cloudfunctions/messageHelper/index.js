// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  //env: "dist-3gfsowkhc324384b"
  // env: "demo-vr23l"
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const messageCollection = db.collection("message")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && messageHelper[event.action]) {
    const result = await messageHelper[event.action](event, wxContext)
    return result
  } else {
    return {
      code: -1,
      message: "invalid action"
    }
  }
}

const messageHelper = {
  // async sendSheet(event, wxContext) { //报单
  //   const {userName, adminName, adminOpenId} = event
  //   const {userOpenId} = wxContext
  //   await messageCollection.add({
  //     data: {
  //       type: "报单管理",
  //       senderId: userOpenId,
  //       senderName: userName,
  //       receiverId: adminOpenId,
  //       receiverName: adminName,
  //       sentTime: db.serverDate(),
  //       read: false,
  //       message: userName + "同学需要你的帮助,快去接单吧！"
  //     }
  //   })
  //   return {
  //     code: 0,
  //     message: "ok"
  //   }
  // },
  async receiveSheet(event, wxContext) {  //接单
    const {messageId} = event
    await messageCollection.doc(messageId).update({
      data: {
        read: true,
        receivedTime: db.serverDate()
      }
    })
    return {
      code: 0,
      message: "ok"
    }
  },
  async getUnreadNum(event, wxContext) {
    const total = (await messageCollection
      .where({
        receiverId: wxContext.OPENID,
        read: false
      })
      .count()
    ).total
    return {
      code: 0,
      message: "ok",
      total
    }
  },
  async getUnreadMessageArray(event, wxContext) {
    // const {curPage, pageSize} = event
    const messageArray = (await messageCollection
      .where({
        receiverId: wxContext.OPENID,
        read: false
      })
      .orderBy("sentTime", "desc")  //降序
      .get()
    ).data
    return {
      code: 0,
      message: "ok",
      messageArray
    }
  },
  async getReadMessageNum(event, wxContext) {
    const total = (await messageCollection
      .where({
        receiverId: wxContext.OPENID,
        read: true
      })
      .count()
    ).total
    return {
      code: 0,
      message: "ok",
      total
    }
  },
  async getReadMessageArray(event, wxContext) {
    const {curPage, pageSize, unreadMessageNum} = event
    console.log(curPage, pageSize, (curPage - 1) * pageSize)
    const messageArray = (await messageCollection
      .where({
        receiverId: wxContext.OPENID,
        read: true
      })
      .orderBy("receivedTime", "desc")
      .skip((curPage - 1) * pageSize + unreadMessageNum)
      .limit(pageSize)
      .get()
    ).data
    return {
      code: 0,
      message: "ok",
      messageArray
    }
  },
  async read(event, wxContext) {
    const {messageId} = event
    await messageCollection.doc(messageId).update({
      data: {
        read: true,
        receivedTime: db.serverDate()
      }
    })
    return {
      code: 0,
      message: "ok"
    }
  },
  async getMessage(event, wxContext) {
    const unreadMessageArray = (await messageCollection
      .where({
        receiverId: wxContext.OPENID,
        read: false
      })
      .orderBy("sentTime", "desc")  //降序
      .get()
    ).data
    const readMessageArray = (await messageCollection
      .where({
        receiverId: wxContext.OPENID,
        read: true
      })
      .orderBy("receivedTime", "desc")
      // .limit(pageSize)
      .get()
    ).data
    const total = readMessageArray.length
    // (await messageCollection
    //   .where({
    //     receiverId: wxContext.OPENID,
    //     read: true
    //   })
    //   .count()
    // ).total
    return {
      code: 0,
      message: "ok",
      total,
      unreadMessageArray,
      readMessageArray
    }
  },
  async offline(event, wxContext) {
    const {_id, name, avatarUrl} = event
    const [data] = (await messageCollection
      .where({
        type: "下线申请",
        senderName: name,
        read: false
      })
      .get()
    ).data
    if (!!data) {
      return {
        code: 1,
        message: "已经存在申请"
      }
    }
    const adminCollection = db.collection("admin")
    const adminArray3 = (await adminCollection
      .where({
        id: 1,
        department: "技术部",
        identity: "部长"
      })
      .get()
    ).data
    var offlineId = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
    for (let i = 0; i < adminArray3.length; i++) {
      await messageCollection.add({
        data: {
          type: "下线申请",
          senderId: wxContext.OPENID,
          senderName: name,
          senderAvatarUrl: avatarUrl,
          receiverId: adminArray3[i].openId,
          receiverName: adminArray3[i].name,
          read: false,
          message: name + "申请下线，是否批准？",
          result: -1,
          adminId: _id,
          sentTime: db.serverDate(),
          offlineId: offlineId
        }
      })
    }
    return {
      code: 0,
      message: "ok"
    }
  },
  async handleOffline(event, wxContext) {
    const {messageId, result, avatarUrl} = event
    const message = (await messageCollection.doc(messageId).get()).data
    // console.log(offlineId)
    if (message.read) {
      return {
        code: 1,
        message: "已被处理",
        resultMsg: message.resultMsg
      }
    }
    var resultMsg = ""
    if (result === 0) {
      resultMsg = "已由" + message.receiverName + "否决"
    } else {
      resultMsg = "已由" + message.receiverName + "批准"
      const adminCollection = db.collection("admin")
      await adminCollection.doc(message.adminId).update({
        data: {
          online: false,
          updatedTime: db.serverDate()
        }
      })
      await messageCollection.add({
        data: {
          type: "通知",
          senderId: wxContext.OPENID,
          senderName: message.receiverName,
          senderAvatarUrl: avatarUrl,
          read: false,
          message: "下线申请已批准",
          receiverId: message.senderId,
          receiverName: message.senderName,
          sentTime: db.serverDate()
        }
      })
      console.log("修改online")
    }
    console.log("修改其它消息")
    const messageArray = (await messageCollection
      .where({
        senderId: message.senderId,
        offlineId: message.offlineId
      })
      .get()
    ).data
    console.log(messageArray, result)
    for (let i = 0; i < messageArray.length; i++) {
      await messageCollection.doc(messageArray[i]._id).update({
        data: {
          read: true,
          result: result,
          resultMsg: resultMsg,
          receivedTime: db.serverDate()
        }
      })
    }
    return {
      code: 0,
      message: "ok",
      resultMsg
    }
  },
  async online(event, wxContext) {
    const {_id, name, avatarUrl} = event
    const [data] = (await messageCollection
      .where({
        type: "上线申请",
        senderName: name,
        read: false
      })
      .get()
    ).data
    console.log(data)
    if (!!data) {
      return {
        code: 1,
        message: "已经存在申请"
      }
    }
    const adminCollection = db.collection("admin")
    const adminArray3 = (await adminCollection
      .where({
        id: 1,
        department: "技术部",
        identity: "部长"
      })
      .get()
    ).data
    var onlineId = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
    for (let i = 0; i < adminArray3.length; i++) {
      await messageCollection.add({
        data: {
          type: "上线申请",
          senderId: wxContext.OPENID,
          senderName: name,
          senderAvatarUrl: avatarUrl,
          receiverId: adminArray3[i].openId,
          receiverName: adminArray3[i].name,
          read: false,
          message: name + "申请上线，是否批准？",
          result: -1,
          adminId: _id,
          sentTime: db.serverDate(),
          onlineId: onlineId,
          
        }
      })
    }
    return {
      code: 0,
      message: "ok"
    }
  },
  async handleOnline(event, wxContext) {
    const {messageId, result, avatarUrl} = event
    // console.log(messageId, result)
    const message = (await messageCollection.doc(messageId).get()).data
    if (message.read) {
      return {
        code: 1,
        message: "已被处理",
        resultMsg: message.resultMsg
      }
    }
    var resultMsg = ""
    if (result === 0) {
      resultMsg = "已由" + message.receiverName + "否决"
    } else {
      resultMsg = "已由" + message.receiverName + "批准"
      const adminCollection = db.collection("admin")
      await adminCollection.doc(message.adminId).update({
        data: {
          online: true,
          updatedTime: db.serverDate()
        }
      })
      await messageCollection.add({
        data: {
          type: "通知",
          senderId: wxContext.OPENID,
          senderName: message.receiverName,
          senderAvatarUrl: avatarUrl,
          read: false,
          message: "上线申请已批准",
          receiverId: message.senderId,
          receiverName: message.senderName,
          sentTime: db.serverDate()
        }
      })
    }
    const messageArray = (await messageCollection
      .where({
        senderId: message.senderId,
        onlineId: message.onlineId
      })
      .get()
    ).data
    for (let i = 0; i < messageArray.length; i++) {
      await messageCollection.doc(messageArray[i]._id).update({
        data: {
          read: true,
          result: result,
          resultMsg: resultMsg,
          receivedTime: db.serverDate()
        }
      })
    }
    return {
      code: 0,
      message: "ok",
      resultMsg: resultMsg
    }
  },
  async nickName(event, wxContext) {
    const {_id, name, avatarUrl, nickName} = event
    const [data] = (await messageCollection
      .where({
        type: "修改昵称",
        senderName: name,
        read: false
      })
      .get()
    ).data
    console.log(data)
    if (!!data) {
      return {
        code: 1,
        message: "已经存在申请"
      }
    }
    const adminCollection = db.collection("admin")
    const adminArray3 = (await adminCollection
      .where({
        id: 1,
        department: "技术部",
        identity: "部长"
      })
      .get()
    ).data
    var nickNameId = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
    for (let i = 0; i < adminArray3.length; i++) {
      await messageCollection.add({
        data: {
          type: "修改昵称",
          senderId: wxContext.OPENID,
          senderName: name,
          senderAvatarUrl: avatarUrl,
          receiverId: adminArray3[i].openId,
          receiverName: adminArray3[i].name,
          read: false,
          message: name + "请求将昵称修改为" + nickName + "是否同意？",
          result: -1,
          adminId: _id,
          sentTime: db.serverDate(),
          nickName: nickName,
          nickNameId: nickNameId
        }
      })
    }
    return {
      code: 0,
      message: "ok"
    }
  },
  async handleNickName(event, wxContext) {
    const {messageId, result, avatarUrl} = event
    const message = (await messageCollection.doc(messageId).get()).data
    if (message.read) {
      return {
        code: 1,
        message: "已被处理",
        resultMsg: message.resultMsg
      }
    }
    var resultMsg = ""
    if (result === 0) {
      resultMsg = "已由" + message.receiverName + "否决"
    } else {
      resultMsg = "已由" + message.receiverName + "批准"
      var nickName = message.nickName
      if (nickName == message.senderName) {
        nickName = null
      }
      const adminCollection = db.collection("admin")
      await adminCollection.doc(message.adminId).update({
        data: {
          nickName: nickName
        }
      })
      await messageCollection.add({
        data: {
          type: "通知",
          senderId: wxContext.OPENID,
          senderName: message.receiverName,
          senderAvatarUrl: avatarUrl,
          read: false,
          message: "昵称（" + message.nickName + "）修改已批准",
          receiverId: message.senderId,
          receiverName: message.senderName,
          sentTime: db.serverDate()
        }
      })
      console.log("修改nickName")
    }
    const messageArray = (await messageCollection
      .where({
        senderId: message.senderId,
        nickNameId: message.nickNameId
      })
      .get()
    ).data
    for (let i = 0; i < messageArray.length; i++) {
      await messageCollection.doc(messageArray[i]._id).update({
        data: {
          read: true,
          result: result,
          resultMsg: resultMsg,
          receivedTime: db.serverDate()
        }
      })
    }
    return {
      code: 0,
      message: "ok",
      resultMsg
    }
  },
  async revokeNickName(event, wxContext) {
    const {name} = event
    const messageArray = (await messageCollection
      .where({
        type: "修改昵称",
        senderName: name,
        read: false
      })
      .get()
    ).data
    console.log(messageArray, name)
    if (messageArray.length == 0) {
      return {
        code: 1,
        message: "申请不存在"
      }
    } else {
      for (let i = 0; i < messageArray.length; i++) {
        await messageCollection.doc(messageArray[i]._id).update({
          data: {
            read: true,
            result: -2,
            resultMsg: "已撤销",
            receivedTime: db.serverDate()
          }
        })
      }
      return {
        code: 0,
        message: "ok"
      }
    }
  },
  async revokeOnline(event, wxContext) {
    const {name} = event
    const messageArray = (await messageCollection
      .where({
        type: "上线申请",
        senderName: name,
        read: false
      })
      .get()
    ).data
    console.log(messageArray, name)
    if (messageArray.length == 0) {
      return {
        code: 1,
        message: "申请不存在"
      }
    } else {
      for (let i = 0; i < messageArray.length; i++) {
        await messageCollection.doc(messageArray[i]._id).update({
          data: {
            read: true,
            result: -2,
            resultMsg: "已撤销",
            receivedTime: db.serverDate()
          }
        })
      }
      return {
        code: 0,
        message: "ok"
      }
    }
  },
  async revokeOffline(event, wxContext) {
    const {name} = event
    const messageArray = (await messageCollection
      .where({
        type: "下线申请",
        senderName: name,
        read: false
      })
      .get()
    ).data
    console.log(messageArray, name)
    if (messageArray.length == 0) {
      return {
        code: 1,
        message: "申请不存在"
      }
    } else {
      for (let i = 0; i < messageArray.length; i++) {
        await messageCollection.doc(messageArray[i]._id).update({
          data: {
            read: true,
            result: -2,
            resultMsg: "已撤销",
            receivedTime: db.serverDate()
          }
        })
      }
      return {
        code: 0,
        message: "ok"
      }
    }
  },
}