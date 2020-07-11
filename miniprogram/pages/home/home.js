/**
 * todo:
 * 从订单页重定向到主页后,数据不会刷新
 * 
 * done:
 *  * // 加载缓慢  =>下拉加载缓慢,
 *  * 从订单页订单提交数据后,如果超过库存数量的处理(在订单详情页进行判断)
 */

// 获取产品
import getPro from "../../modules/getPro";
// 获取订单订购数量
var getTotal = require('../../modules/getNums')
let timeago = require('../../modules/timeago')
const app = getApp()
Page({
  // 页面初始数据
  data: {
    // 产品信息
    meta: '',
    // 订单信息
    orders: [],
  },

  // handleJump轮播图跳转
  handleJump(e) {
    getPro(e)
  },

  // 商品详情跳转
  handleSkip(e) {
    getPro(e)
  },

  // 获取数据
  onLoadData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const db = wx.cloud.database()
    // 获取产品
    db.collection('products').where({}).get().then(res => {
      this.setData({
        meta: res.data
      })
      // 获取订单,轮播图动态展示
      db.collection('orders').where({}).get().then(res => {
        let res_map = res.data.map((item, index, self) => {
          item.timer = timeago(item.timer)
          return item
        })
        this.setData({
          orders: res_map,
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
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

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 获取数据
    this.onLoadData()
    this.onGetTotal(options.id)
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    this.onLoadData()
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},

  // 用户点击右上角分享
  onShareAppMessage: function () {},
})