const getPro = (e) => {
  const id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: `/pages/order/detail?id=${id}`
  })
  console.log(id)
}

export default getPro