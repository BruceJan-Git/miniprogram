// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()

  return db.collection('orders').where({
      _id: event._id
    })
    .update({
      data: {
        status: '正在配送...',
        flag_sub: true
      }
    })
}