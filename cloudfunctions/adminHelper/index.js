// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  //env: "dist-3gfsowkhc324384b"
  // env: "demo-vr23l"
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const adminCollection = db.collection("admin")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && adminHelper[event.action]) {
    const result = await adminHelper[event.action](event, wxContext)
    return result
  } else {
    return {
      code: -1,
      message: "invalid action"
    }
  }
}
const adminHelper = {
  async init(event, wxContext) {
    const {password2, password3, password4, password5, password6, update} = event
    const [data] = (await adminCollection
      .where({
        id: 0
      })
      .get()
    ).data
    if (!!data) {
      //新建
      await adminCollection.doc(data._id).update({
        data: {
          password2,
          password3,
          password4,
          password5,
          password6,
          update: update,
          updatedBy: wxContext.OPENID,
          updatedTime: db.serverDate()
        }
      })
      return {
        code: 1,
        message: "init, update"
      }
    } else {
      //更新
      await adminCollection.add({
        data: {
          id: 0,
          createdBy: wxContext.OPENID,
          createdTime: db.serverDate(),
          updatedBy: wxContext.OPENID,
          updatedTime: db.serverDate(),
          password2,
          password3,
          password4,
          password5,
          update
        }
      })
      return {
        code: 0,
        message: "更新成功"
      }
    }
  },
  async identify(event, wxContext) {
    const {password, name, department, email, avatarUrl, wechat} = event
    const userCollection = db.collection("users")
    const [user] = (await userCollection
      .where({
        openId: wxContext.OPENID
      })
      .get()
    ).data
    if (!user.avatarUrl) {
      return {
        code: 1,
        message: "请先登陆"
      }
    }
    const [admin] = (await adminCollection
      .where({
        openId: wxContext.OPENID
      })
      .get()
    ).data
    if (!!admin) {
      return {
        code: 3,
        message: "已经存在认证"
      }
    } else {
      const [data] = (await adminCollection
        .where({
          id: 0
        })
        .get()
      ).data
      //新的认证
      if (password === data.password2) {
        //干事
        const adminId = await adminCollection.add({
          data: {
            id: 1,
            openId: wxContext.OPENID,
            createdTime: db.serverDate(),
            updatedTime: db.serverDate(),
            name,
            department,
            identity: "干事",
            email,
            online: true,
            avatarUrl,
            wechat,
            times: 3
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 2,
            adminId: adminId._id
          }
        })
        return {
          code: 0,
          identity: 2,
          identity2: "干事",
          adminId,
          // adminArray,
          ingNum: 0, completedNum: 0, totalNum: 0,
          message: "认证成功"
        }
      } else if (password === data.password3) {
        //部长
        const adminId = await adminCollection.add({
          data: {
            id: 1,
            openId: wxContext.OPENID,
            createdTime: db.serverDate(),
            updatedTime: db.serverDate(),
            name,
            department,
            identity: "部长",
            online: false,
            email,
            avatarUrl,
            wechat,
            times: 3
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 3,
            adminId: adminId._id
          }
        })
        return {
          code: 0,
          identity: 3,
          identity2: "部长",
          adminId,
          ingNum: 0, completedNum: 0, totalNum: 0,
          message: "认证成功"
        }
      } else if (password === data.password4) {
        //会长
        const adminId = await adminCollection.add({
          data: {
            id: 1,
            openId: wxContext.OPENID,
            createdTime: db.serverDate(),
            updatedTime: db.serverDate(),
            name,
            department,
            identity: "会长",
            online: false,
            email,
            avatarUrl,
            wechat,
            times: 3
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 4,
            adminId: adminId._id
          }
        })
        return {
          code: 0,
          identity: 4,
          identity2: "会长",
          adminId,
          ingNum: 0, completedNum: 0, totalNum: 0,
          message: "认证成功"
        }
      } else if (password === data.password5) {
        //老人
        const adminId = await adminCollection.add({
          data: {
            id: 1,
            openId: wxContext.OPENID,
            createdTime: db.serverDate(),
            updatedTime: db.serverDate(),
            name,
            department,
            identity: "老人",
            email,
            avatarUrl,
            wechat
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 5,
            adminId: adminId._id
          }
        })
        return {
          code: 0,
          identity: 5,
          identity2: "老人",
          adminId,
          ingNum: 0, completedNum: 0, totalNum: 0,
          message: "认证成功"
        }
      } else if (password === data.password6) {
        //SA
        const adminId = await adminCollection.add({
          data: {
            id: 1,
            openId: wxContext.OPENID,
            createdTime: db.serverDate(),
            updatedTime: db.serverDate(),
            name,
            department,
            identity: "SA",
            email,
            avatarUrl,
            wechat
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 6,
            adminId: adminId._id
          }
        })
        return {
          code: 0,
          identity: 6,
          identity2: "SA",
          adminId,
          ingNum: 0, completedNum: 0, totalNum: 0,
          message: "认证成功"
        }
      } else {
        return {
          code: 2,
          message: "incorrect password"
        }
      }
    } 
  },
  async getIdentity(event, wxContext) {
    const [adminInfo] = (await adminCollection
      .where({
        openId: wxContext.OPENID
      })
      .get()
    ).data
    var identityList = {
      "干事": 2,
      "部长": 3,
      "会长": 4,
      "老人": 5,
      "SA": 6
    }
    if (!!adminInfo) {
      return {
        code: 0,
        message: "get successfully",
        adminInfo: {
          _id: adminInfo._id,
          name: adminInfo.name,
          nickName: adminInfo.nickName,
          department: adminInfo.department,
          email: adminInfo.email,
          identity: adminInfo.identity,
          online: adminInfo.online,
          wechat: adminInfo.wechat
        },
        identity: identityList[adminInfo.identity]
      }
    } else {
      return {
        code: 1,
        message: "not identified"
      }
    }
  },
  async offline(event, wxContext) {
    const {adminId, name, avatarUrl, adminOpenId, adminName} = event
    // const [adminInfo] = (await adminCollection
    //   .where({
    //     id: 1,
    //     name: name
    //   })
    //   .get()
    // ).data
    // if (!!adminInfo) {
    await adminCollection.doc(adminId).update({
      data: {
        online: false,
        updatedTime: db.serverDate()
      }
      })
    const messageCollection = db.collection("message")
    await messageCollection.add({
      data: {
        type: "通知",
        senderId: wxContext.OPENID,
        senderName: name,
        senderAvatarUrl: avatarUrl,
        read: false,
        message: "你已下线。",
        receiverId: adminOpenId,
        receiverName: adminName,
        sentTime: db.serverDate()
      }
    })
    return {
      code: 0,
      message: "offline successfully"
    }
    // } else {
    //   return {
    //     code: 1,
    //     message: "no such admin"
    //   }
    // }
  },
  async online(event, wxContext) {
    const {adminId, name, avatarUrl, adminOpenId, adminName} = event
    await adminCollection.doc(adminId).update({
      data: {
        online: true,
        updatedTime: db.serverDate()
      }
    })
    const messageCollection = db.collection("message")
    await messageCollection.add({
      data: {
        type: "通知",
        senderId: wxContext.OPENID,
        senderName: name,
        senderAvatarUrl: avatarUrl,
        read: false,
        message: "你已上线。",
        receiverId: adminOpenId,
        receiverName: adminName,
        sentTime: db.serverDate()
      }
    })
    return {
      code: 0,
      message: "上线成功"
    }
  },
  async getOnlineAdminArray(event, wxContext) {
    const adminArray = (await adminCollection
      .where({
        id: 1,
        department: "技术部",
        identity: _.or(_.eq("部长"), _.eq("干事"), _.eq("会长")),
        online: true
      })
      .orderBy("name", "asc")  //asc
      .get()
    ).data
    // console.log(adminArray)
    var total = adminArray.length
    return {
      code: 0,
      total,
      adminArray
    }
  },
  // async getAdminArray(event, wxContext) {
  //   const adminArray = (await adminCollection
  //     .where({
  //       id: 1,
  //       department: "技术部",
  //       identity: "干事"
  //     })
  //     .orderBy("name", "asc")  //asc
  //     .get()
  //   ).data
  //   console.log(adminArray)
  //   var total = adminArray.length
  //   return {
  //     code: 0,
  //     total,
  //     adminArray
  //   }
  // },
  async getMember(event, wxContext) {
    const adminArray2 = (await adminCollection
      .where({
        id: 1,
        department: "技术部",
        identity: "干事"
      })
      .orderBy("name", "asc")
      .get()
    ).data
    const adminArray34 = (await adminCollection
      .where({
        id: 1,
        department: "技术部",
        identity: _.or(_.eq("部长"), _.eq("会长"))
      })
      .orderBy("identity", "asc")
      .orderBy("name", "asc")
      .get()
    ).data
    const adminArray5 = (await adminCollection
      .where({
        id: 1,
        department: "技术部",
        identity: _.or(_.eq("老人"), _.eq("SA"))
      })
      .orderBy("createdTime", "desc")
      .get()
    ).data
    // console.log(adminArray2, adminArray3, adminArray4)
    return {
      code: 0,
      message: "ok",
      adminArray2,
      adminArray34,
      adminArray5
    }
  },
  async updateIdentity(event, wxContext) {
    const {password, adminId} = event
    const [data] = (await adminCollection
      .where({
        id: 0
      })
      .get()
    ).data
    if (!data.update) {
      return {
        code: 3,
        message: "暂未开放"
      }
    }
    const admin = (await adminCollection.doc(adminId).get()).data
    if(!!admin) {
      //有内容
      const userCollection = db.collection("users")
      const [user] = (await userCollection
        .where({
          openId: wxContext.OPENID
        })
        .get()
      ).data
      if (password === data.password2) {
        //干事更新
        await adminCollection.doc(admin._id).update({
          data: {
            updatedTime: db.serverDate(),
            identity: "干事",
            online: true,
            times: 3
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 2,
            updatedTime: db.serverDate()
          }
        })
        return {
          code: 0,
          identity: 2,
          identity2: "干事",
          message: "更新认证成功"
        }
      } else if (password === data.password3) {
        //部长更新
        await adminCollection.doc(admin._id).update({
          data: {
            updatedTime: db.serverDate(),
            identity: "部长",
            online: false,
            times: 3
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 3,
            updatedTime: db.serverDate()
          }
        })
        return {
          code: 0,
          identity: 3,
          identity2: "部长",
          message: "更新认证成功"
        }
      } else if (password === data.password4) {
        //会长更新
        await adminCollection.doc(admin._id).update({
          data: {
            updatedTime: db.serverDate(),
            identity: "会长",
            online: false,
            times: 3
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 4,
            updatedTime: db.serverDate()
          }
        })
        return {
          code: 0,
          identity: 4,
          identity2: "会长",
          message: "更新认证成功"
        }
      } else if (password === data.password5) {
        await adminCollection.doc(admin._id).update({
          data: {
            updatedTime: db.serverDate(),
            identity: "老人",
            online: false
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 5,
            updatedTime: db.serverDate()
          }
        })
        return {
          code: 0,
          identity: 5,
          identity2: "老人",
          message: "更新认证成功"
        }
      } else if (password === data.password6) {
        await adminCollection.doc(admin._id).update({
          data: {
            updatedTime: db.serverDate(),
            identity: "SA"
          }
        })
        await userCollection.doc(user._id).update({
          data: {
            identity: 6,
            updatedTime: db.serverDate()
          }
        })
        return {
          code: 0,
          identity: 6,
          identity2: "SA",
          message: "更新认证成功"
        }
      } else {
        return {
          code: 2,
          message: "密匙错误"
        }
      }
    } else {
      return {
        code: 1,
        message: "没有认证信息"
      }
    }
  },
  async updateNickName(event, wxContext) {
    const {nickName, adminId} = event
    // const [adminInfo] = (await adminCollection
    //   .where({
    //     id: 1,
    //     openId: wxContext.OPENID
    //   })
    //   .get()
    // ).data
    // if (!!adminInfo) {
      await adminCollection.doc(adminId).update({
        data: {
          nickName,
          updatedTime: db.serverDate()
        }
      })
      return {
        code: 0,
        message: "update successfully"
      }
    // } else {
    //   return {
    //     code: 1,
    //     message: "not identified"
    //   }
    // }
  },
  async manageIdentify(event, wxContext) {
    const [data] = (await adminCollection
      .where({
        id: 0
      })
      .get()
    ).data
    // console.log(data)
    if (!!data) {
      return {
        code: 0,
        message: "ok",
        update: data.update,
        password: {
          password2: data.password2,
          password3: data.password3,
          password4: data.password4,
          password5: data.password5
        },
        notice: data.notice
      }
    } else {
      return {
        code: 1,
        message: "还没有设置"
      }
    }
  },
  async getNotice(event, wxContext) {
    const [data] = (await adminCollection
      .where({
        id: 0
      })
      .get()
    ).data
    if (!!data) {
      return {
        code: 0,
        message: "ok",
        notice: data.notice
      }
    } else {
      return {
        code: 1,
        message: "还没有设置"
      }
    }
  },
  async setNotice(event, wxContext) {
    const {notice} = event
    const [data] = (await adminCollection
      .where({
        id: 0
      })
      .get()
    ).data
    // console.log(data, notice)
    await adminCollection.doc(data._id).update({
      data: {
        notice: notice,
        updatedTime: db.serverDate(),
        updatedBy: wxContext.OPENID
      }
    })
    return {
      code: 0,
      message: "ok"
    }
  },
  changeIdentity: async function(event, wxContext) {
    const {adminId, name, avatarUrl, adminOpenId, adminName} = event
    await adminCollection.doc(adminId).update({
      data: {
        online: false,
        updatedTime: db.serverDate(),
        identity: "老人"
      }
    })
    const userCollection = db.collection("users")
    const [user] = (await userCollection
      .where({
        openId: adminOpenId
      })
      .get()
    ).data
    await userCollection.doc(user._id).update({
      data: {
        identity: 5,
        updatedTime: db.serverDate()
      }
    })
    const messageCollection = db.collection("message")
    await messageCollection.add({
      data: {
        type: "通知",
        senderId: wxContext.OPENID,
        senderName: name,
        senderAvatarUrl: avatarUrl,
        read: false,
        message: "你的认证已修改为老人。",
        receiverId: adminOpenId,
        receiverName: adminName,
        sentTime: db.serverDate()
      }
    })
    return {
      code: 0,
      message: "ok"
    }
  }
}