/**
 * todo:
 * // 是否对错误进行处理
 * 
 **/
// 获取用户提交的订单信息
module.exports = function getNums(id) {
  const db = wx.cloud.database({
    throwOnNotFound: false
  })
  let res = db.collection('orders').doc(`${id}`).get().then(res => {
      return [res.data.nums, res.data.pid]
    })
    .catch(err => {
      // 是否对错误进行处理
      return
      console.log(err)
    })
  return res // 返回一个promise对象
}