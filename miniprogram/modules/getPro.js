// 根据商品id进行跳转
const getPro = (e) => {
  const id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: `/pages/order/detail?id=${id}`
  })
}

export default getPro