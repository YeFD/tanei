// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  //env: "dist-3gfsowkhc324384b"
  // env: "demo-vr23l"
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const usersCollection = db.collection("users")

var request = require('request-promise')

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
    var {nickName, avatarUrl, gender} = event
    const [userInfo] = (await usersCollection
      .where({
        openId: wxContext.OPENID
      })
      .get()
    ).data
    var res = await this.uploadAvatar(avatarUrl, wxContext.OPENID)
    avatarUrl = res.avatarUrl
    if (!!userInfo) { // 有注册信息
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
          message: "register (update) successfully", avatarUrl
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
    } else { //新用户
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
    var {nickName, avatarUrl, gender, adminId} = event
    var res = await this.uploadAvatar(avatarUrl, wxContext.OPENID)
    avatarUrl = res.avatarUrl
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
        message: "login(register) successfully", avatarUrl
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
  },
  async test(event, wxContext) {
    var avatarUrl = "https://thirdwx.qlogo.cn/mmopen/vi_32/XYy5P1KibeQ4IvoArSOls2oK6cxIYNYcf2Fx3FjqnTKia5TdGMxht285ceBiagWcHBJbNzNhUzL2r6Df4gOr3pF7g/132"
    console.log("test", wxContext.OPENID)
    var res = await this.uploadAvatar(avatarUrl, wxContext.OPENID)
    console.log("res", res.avatarUrl)
  },
  async uploadAvatar(avatarUrl, OpenId) { //上传头像
    var avatarBuffer, newUrl
    await request({
      url: avatarUrl,
      method: 'GET',
      encoding: null,
    }).catch(e => {
      console.error(e)
    }).then(res => {
      console.log(res)
      avatarBuffer = res
    })
    if (avatarBuffer.length < 512) {
      console.error("ivalid avatar")
      newUrl = "https://6465-demo-vr23l-1259081600.tcb.qcloud.la/image/defaultAvatar.jpg"
    } else {
      await cloud.uploadFile({
        cloudPath: 'userAvatar/' + OpenId + '.png',
        fileContent: avatarBuffer,
      }).catch(e => {
        console.error(e)
      }).then(res => {
        console.log(res)
        if (res.fileID[9] == 'i') { // env dist
          newUrl = "https://6469-dist-3gfsowkhc324384b-1259081600.tcb.qcloud.la/userAvatar/" + OpenId + ".png"
        } else if(res.fileID[9] == 'e') { //env demo
          newUrl = "https://6465-demo-vr23l-1259081600.tcb.qcloud.la/userAvatar/" + OpenId + ".png"
        }
      })
    }
    return {code: 0, avatarUrl: newUrl}
  },
  /* // @Deprecated
  async uploadAvatar2(event, wxContext) { // 含验证是否无效 @Deprecated
    var {_id, avatarUrl, openId, adminId} = event
    var invalidUrl = "https://thirdwx.qlogo.cn/mmopen/vi_32/rA9vCD8iar9oP7dl2j3tGpSiado2W5CMdOxFfQ0aoBiahiaP9xvLbuD2r7wk9FicxFneAztcJKLAg1MWicy7kPSJpl8g/132"
    var avatarBuffer, invalidAvatar, newUrl
    await request({
      url: avatarUrl,
      method: 'GET',
      encoding: null,
    }).catch(e => {
      console.error(e)
    }).then(res => {
      avatarBuffer = res
    })
    await request({
      url: invalidUrl,
      method: 'GET',
      encoding: null,
    }).catch(e => {
      console.error(e)
    }).then(res => {
      invalidAvatar = res
    })
    if (!avatarBuffer || avatarBuffer.length < 512 || avatarBuffer.equals(invalidAvatar)) {
      console.error("ivalid avatar")
      newUrl = "https://6465-demo-vr23l-1259081600.tcb.qcloud.la/image/defaultAvatar.jpg"
    } else {
      await cloud.uploadFile({
        cloudPath: 'userAvatar/' + openId + '.png',
        fileContent: avatarBuffer,
      }).catch(e => {
        console.error(e)
      }).then(res => {
        console.log(res)
        if (res.fileID[9] == 'i') { // env dist
          newUrl = "https://6469-dist-3gfsowkhc324384b-1259081600.tcb.qcloud.la/userAvatar/" + openId + ".png"
        } else if(res.fileID[9] == 'e') { //env demo
          newUrl = "https://6465-demo-vr23l-1259081600.tcb.qcloud.la/userAvatar/" + openId + ".png"
        }
      })
    }
    await usersCollection.doc(_id).update({
      data: {
        avatarUrl: newUrl,
        updatedTime: db.serverDate()
      }
    })
    if (!!adminId) {
      const adminCollection = db.collection("admin")
      console.log("admin", adminId)
      // const data = await adminCollection.doc(adminId).get()
      // console.log(data)
      await adminCollection.doc(adminId).update({
        data: {
          avatarUrl: newUrl,
          updatedTime: db.serverDate()
        }
      })
    }
    return {code: 0, avatarUrl: newUrl}
  },
  async uploadAllAvatar() { //@Deprecated
    var invalidUrl = "https://thirdwx.qlogo.cn/mmopen/vi_32/rA9vCD8iar9oP7dl2j3tGpSiado2W5CMdOxFfQ0aoBiahiaP9xvLbuD2r7wk9FicxFneAztcJKLAg1MWicy7kPSJpl8g/132"
    var invalidAvatar
    await request({
      url: invalidUrl,
      method: 'GET',
      encoding: null,
    }).catch(e => {
      console.error(e)
    }).then(res => {
      invalidAvatar = res
    })
    const totalNum = (await usersCollection
      .where({
        identity: _.neq(0)
      })
      .count()
    ).total
    for (let i = 0; i <= totalNum / 100; i++) {
      const array = (await usersCollection
        .where({
          identity: _.neq(0)
        })
        .skip(i * 100)
        .get()
      ).data
      for (let j = 0; j < array.length; j++) {
        var {_id, openId, avatarUrl, adminId} = array[j]
        if (!avatarUrl) continue
        console.log(i, j, _id, openId, avatarUrl)
        let avatarBuffer
        await request({
          url: avatarUrl,
          method: 'GET',
          encoding: null,
        }).catch(e => {
          console.error(e)
        }).then(res => {
          avatarBuffer = res
        })
        if (!avatarBuffer || avatarBuffer.length < 512 || avatarBuffer.equals(invalidAvatar)) {
          console.error("ivalid avatar")
          avatarUrl = "https://6465-demo-vr23l-1259081600.tcb.qcloud.la/image/defaultAvatar.jpg"
        } else {
          await cloud.uploadFile({
            cloudPath: 'userAvatar/' + openId + '.png',
            fileContent: avatarBuffer,
          }).catch(e => {
            console.error(e)
          }).then(res => {
            // console.log(res)
            if (res.fileID[9] == 'i') { // env dist
              avatarUrl = "https://6469-dist-3gfsowkhc324384b-1259081600.tcb.qcloud.la/userAvatar/" + openId + ".png"
            } else if(res.fileID[9] == 'e') { //env demo
              avatarUrl = "https://6465-demo-vr23l-1259081600.tcb.qcloud.la/userAvatar/" + openId + ".png"
            }
          })
        }
        await usersCollection.doc(_id).update({
          data: {
            avatarUrl: avatarUrl
          }
        })
        if (!!adminId) {
          const adminCollection = db.collection("admin")
          console.log("admin", adminId)
          // const data = await adminCollection.doc(adminId).get()
          // console.log(data)
          await adminCollection.doc(adminId).update({
            data: {
              avatarUrl: avatarUrl
            }
          })
        }
        console.log(i, j, _id, openId, avatarUrl)
      }
    }
  },
  */
  async updateUserAvatar(event, wxContext) { //disable
    const {_id, openId, avatarUrl, adminId} = event
    await usersCollection.doc(_id).update({
      data: {
        avatarUrl
      }
    })
    if (!!adminId) {
      const adminCollection = db.collection("admin")
      await adminCollection.doc(adminId).update({
        data: {
          avatarUrl: avatarUrl
        }
      })
    }
    return {
      code: 0,
      message: "update user avatar"
    }
  },
  async getAllUser(event, wxContext) {
    const totalNum = (await usersCollection
      .count()
    ).total
    var userArray = []
    for (let i = 0; i <= totalNum / 100; i++) {
      const array = (await usersCollection
        .skip(i * 100)
        .get()
      ).data
      for (let j = 0; j < array.length; j++) {
        userArray.push(array[j])
      }
    }
    return {
      code: 0,
      total: totalNum,
      userArray
    }
  }
}