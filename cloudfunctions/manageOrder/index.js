// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()

  return db.collection('orders')
    .where({
      pName: event.name
    })
    .update({
      data: {
        status: event.status,
        flag_sub: true
      }
    })

}