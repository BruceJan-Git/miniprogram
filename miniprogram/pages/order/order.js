import getPro from "../../modules/getPro"
let timeago = require('../../modules/timeago')
// 获取订单订购数量
var getTotal = require('../../modules/getNums')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: "order",
    meta: [],
    // 订单数据
    orders: [],
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
          let res_map = res.result.data.map((item, index, self) => {
            item.timer = timeago(item.timer)
            return item
          })
          this.setData({
            orders: res_map,
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

  onGetTotal(id) {
    // 获取订单订购数量(订购数量,以及所订购商品id)
    let res = getTotal(id)
    // var that = this
    res.then(res => {
      // 判断是否有订单信息
      if (res) {
        // that.onPullDownRefresh()
        let [nums, id] = res
        nums = Number(nums)
        // 调用云函数,更新商品总数
        wx.cloud.callFunction({
          name: 'updater_total',
          data: {
            nums: nums,
            id: id
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },

  // 客户端删除单个订单
  handleDelSell(e) {
    let this_ = this
    const db = wx.cloud.database()
    wx.showModal({
      content: '确认删除该订单吗?',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
              name: 'delSellOrder',
              data: {
                id: e.currentTarget.dataset.id
              }
            })
            .then(res => {
              if (res.result.errMsg === 'document.remove:ok') {
                wx.showToast({
                  title: '删除成功',
                })
                this_.onLoadData()
              }
            })
            .catch(err => {
              wx.showToast({
                title: '删除失败,请稍后再试' + err,
                icon: 'none'
              })
            })
          db.collection('orders').where({
              _id: e.currentTarget.dataset._id
            })
            .get()
            .then(res => {
              wx.cloud.callFunction({
                name: 'updater_total',
                data: {
                  nums: -res.data[0].nums,
                  id: res.data[0].pid
                }
              }).then(res => {
                if (res.result.errMsg === 'collection.update:ok') {
                  console.log('库存更新成功')
                }
              })
            })
            .catch(err => console.log(err))
        } else if (res.cancel) {
          wx.showToast({
            title: '取消删除',
            icon: 'none'
          })
        }
      }
    })

  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.onGetOpenid()
    // this.onLoadData()
    this.onGetTotal(options.id)
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