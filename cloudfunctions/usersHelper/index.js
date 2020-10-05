// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "dist-3gfsowkhc324384b"
})
const db = cloud.database()
const _ = db.command
const usersCollection = db.collection("users")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && usersHelper[event.action]) {
    const result = await usersHelper[event.action](event, wxContext)
    return result
  } else {
    return {
      code: -1,
      message: "invalid action"
    }
  }
}
const usersHelper = {
  async login(event, wxContext) {
    // console.log(wxContext)
    const [userInfo] = (await usersCollection
      .where({
        openId: wxContext.OPENID
      })
      .get()
    ).data
    //
    // const adminCollection = db.collection("admin")
    // const admins = (await adminCollection
    //   .where({
    //     id: 1,
    //     department: "技术部",
    //     identity: "干事"
    //   })
    //   .orderBy("name", "desc")  //asc
    //   .get()
    // ).data
    // var adminArray = []
    // for (let i = 0; i < admins.length; i++) {
    //   let admin = {
    //     name: admins[i].name,
    //     _id: admins[i]._id,
    //     openId: admins[i].openId,
    //     nickName: admins[i].nickName,
    //     email: admins[i].email
    //   }
    //   adminArray.push(admin)
    // }
    if (!!userInfo) {
      //有记录 获取消息数
      const messageCollection = db.collection("message")
      const total = (await messageCollection
        .where({
          receiverId: wxContext.OPENID,
          read: false
        })
        .count()
      ).total
      if (userInfo.identity === 0) {
        //无用户信息
        return {
          code: 1,
          // logged: false,
          identity: 0,
          msgNum: total,
          // adminArray,
          message: "not registered"
        }
      } else if (userInfo.identity === 1) {
        //普通用户
        return {
          code: 0,
          message: "ok",
          // logged: true,
          identity: 1,
          msgNum: total,
          // adminArray,
          userInfo: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender
          }
        }
      } else {
        const adminCollection = db.collection("admin")
        const adminInfo = (await adminCollection.doc(userInfo.adminId).get()).data
        const repairSheetHelper = db.collection("repairSheet")
        const ingNum = (await repairSheetHelper
          .where({
            repairmanId: wxContext.OPENID,
            state: _.or(_.eq(0), _.eq(1))
          })
          .count()
        ).total
        const completedNum = (await repairSheetHelper
          .where({
            repairmanId: wxContext.OPENID,
            state: _.and(_.neq(0), _.neq(1), _.neq(-1))
          })
          .count()
        ).total
        const totalNum = (await repairSheetHelper
          .where({
            repairmanId: wxContext.OPENID
          })
          .count()
        ).total
        // var date = new Date()
        // var date2 = new Date()
        return {
          code: 0,
          message: "ok",
          identity: userInfo.identity,
          msgNum: total,
          // adminArray,
          userInfo: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender
          },
          adminInfo: {
            _id: adminInfo._id,
            name: adminInfo.name,
            nickName: adminInfo.nickName,
            department: adminInfo.department,
            email: adminInfo.email,
            identity: adminInfo.identity,
            online: adminInfo.online,
            ingNum: ingNum,
            completedNum: completedNum,
            totalNum: totalNum
          }
        }
      }
    } else {
      //无记录，新用户
      await usersCollection.add({
        data: {
          openId: wxContext.OPENID,
          createdTime: db.serverDate(),
          updatedTime: db.serverDate(),
          // logged: false
          identity: 0
        }
      })
      return {
        code: 2,
        // logged: false,
        identity: 0,
        // adminArray,
        message: "not login",
        msgNum: 0
      }
    }
  },
  async register(event, wxContext) {
    const {nickName, avatarUrl, gender} = event
    const [userInfo] = (await usersCollection
      .where({
        openId: wxContext.OPENID
      })
      .get()
    ).data
    if (!!userInfo) {
      if (userInfo.identity <= 1) {
        await usersCollection.doc(userInfo._id).update({
          data: {
            // logged: true,
            identity: 1,
            nickName,
            gender,
            avatarUrl,
            updatedTime: db.serverDate()
          }
        })
        return {
          code: 0,
          message: "register (update) successfully"
        }
      } else {
        // 有管理员信息管理员
        const messageCollection = db.collection("message")
        const total = (await messageCollection
          .where({
            receiverId: wxContext.OPENID,
            read: false
          })
          .count()
        ).total
        const adminCollection = db.collection("admin")
        const adminInfo = (await adminCollection.doc(userInfo.adminId).get()).data
        const repairSheetHelper = db.collection("repairSheet")
        const ingNum = (await repairSheetHelper
          .where({
            repairmanId: wxContext.OPENID,
            state: _.or(_.eq(0), _.eq(1))
          })
          .count()
        ).total
        const completedNum = (await repairSheetHelper
          .where({
            repairmanId: wxContext.OPENID,
            state: _.and(_.neq(0), _.neq(1), _.neq(-1))
          })
          .count()
        ).total
        const totalNum = (await repairSheetHelper
          .where({
            repairmanId: wxContext.OPENID
          })
          .count()
        ).total
        // var date = new Date()
        // var date2 = new Date()
        return {
          code: 3,
          message: "ok",
          identity: userInfo.identity,
          msgNum: total,
          // adminArray,
          userInfo: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender
          },
          adminInfo: {
            _id: adminInfo._id,
            name: adminInfo.name,
            nickName: adminInfo.nickName,
            department: adminInfo.department,
            email: adminInfo.email,
            identity: adminInfo.identity,
            ingNum: ingNum,
            completedNum: completedNum,
            totalNum: totalNum,
            online: adminInfo.online
          }
        }
      }
    } else {
      await usersCollection.add({
        data: {
          openId: wxContext.OPENID,
          // logged: true,
          identity: 1,
          nickName,
          gender,
          avatarUrl,
          createdTime: db.serverDate(),
          updatedTime: db.serverDate()
        }
      })
      return {
        code: 1,
        message: "login and register successfully"
      }
    }
    
    
  },
  async updateUserInfo(event, wxContext) {
    console.log(event)
    const {nickName, avatarUrl, gender, adminId} = event
    const [userInfo] = (await usersCollection
      .where({
        openId: wxContext.OPENID
      })
      .get()
    ).data
    if (!userInfo) {
      await usersCollection.add({
        data: {
          openId: wxContext.OPENID,
          logged: true,
          nickName,
          gender,
          avatarUrl,
          createdTime: db.serverDate(),
          updatedTime: db.serverDate()
        }
      })
      return {
        code: 1,
        message: "login and register successfully"
      }
    } else {
      await usersCollection.doc(userInfo._id).update({
        data: {
          nickName,
          gender,
          avatarUrl,
          updatedTime: db.serverDate()
        }
      })
      if (!!adminId) {
        const adminCollection = db.collection("admin")
        console.log(adminId, avatarUrl)
        // const data = await adminCollection.doc(adminId).get()
        // console.log(data)
        await adminCollection.doc(adminId).update({
          data: {
            avatarUrl: avatarUrl
          }
        })
        console.log(2)
      }
      return {
        code: 0,
        message: "update successfully"
      }
    }
  }
}