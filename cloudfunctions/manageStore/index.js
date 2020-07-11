// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  return db.collection('products').where({
      name: event.name
    })
    .update({
      data: {
        count: event.count,
        sell: event.sell
      }
    })
}