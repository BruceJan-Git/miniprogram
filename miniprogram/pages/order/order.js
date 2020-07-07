import getPro from "../../modules/getPro"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: "order",
    meta: [],
    // 订单数据
    order: [],
    ownId: ''
  },

  /**
   * @Explain：
   */
  handleJump(e) {
    getPro(e)
  },

  // tab栏切换
  handTab(e) {
    let index = e.target.dataset.index
    this.setData({
      currentTab: index
    })
  },

  // 加载数据
  onLoadData() {
    wx.showLoading({
      title: '加载中...🐄',
      mask: true
    })
    const db = wx.cloud.database()
    // 获取产品列表数据
    db.collection('products').where({}).get().then(res => {
      this.setData({
        meta: res.data
      })
      // 获取订单数据
      if (this.data.ownId) {
        wx.cloud.callFunction({
          name: 'getOwnOrder',
          data: {
            id: this.data.ownId
          }
        }).then(res => {
          this.setData({
            order: res.result.data
          })
          wx.hideLoading()
          wx.stopPullDownRefresh()
        })
      }
    })
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.setData({
          ownId: res.result.openid
        }, () => {
          console.log(this.data.ownId)
          this.onLoadData()
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    return true
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.onGetOpenid()
    // this.onLoadData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('页面滚动到了底部...')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})