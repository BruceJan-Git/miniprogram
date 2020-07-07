// 云函数,更新产商品库存
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  // 默认情况下，如果获取不到记录，方法会抛出异常，建议设置为返回空而不是抛出异常
  const db = cloud.database({
    throwOnNotFound: false
  })
  const _ = db.command
  return db.collection('products').where({
    pid: event.id
  }).update({
    data: {
      count: _.inc(-event.nums),
      sell: _.inc(event.nums),
    }
  })
}