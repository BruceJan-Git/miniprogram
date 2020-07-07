module.exports = function (id_orders, that) {
  // 调用云函数获取该产品已订购数量
  let res_promise = wx.cloud.callFunction({
    name: 'getSell',
    data: {
      pid: id_orders
    }
  })
  res_promise.then(res => {
    let arr = res.result.data
    let total = 0
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      total += element.nums
    }
    that.setData({
      sell: total
    })
  }).catch(err => {
    console.log(err)
  })
}