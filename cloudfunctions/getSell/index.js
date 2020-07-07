// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    throwOnNotFound: false
  })
  const _ = db.command
  return db.collection('orders').where({
    pid: event.pid
  }).get()
}