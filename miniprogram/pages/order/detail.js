/**
 * todo:
 * 
 * done:
 *  * 提交订单的函数是否可以作为setData的回调函数 // 可以,就不用验证this.data.userName是否有值
 *  * 订单提交所选的最少商品数量
 *  * 连续点击提交按钮,出现多次提交订单
 *  * 订单数量限制
 *  * 已售数量处理(使用云函数查询操作) 谋定而后动,浪费时间
 */

const app = getApp()
var util = require('../../modules/formatTime.js')
// var getSell = require('../../modules/getSell.js')
Page({
  // 页面的初始数据
  data: {
    // 产品详情
    detail: [],
    // 选中的数量
    nums: 0,
    // 产品单价
    unitPrice: 0,
    // 产品总价
    totalPrice: 0,
    // 产品id
    proId: 0,
    // 是否禁用按钮
    btn_flag: false,
    // 存储用户账户名
    userName: '',
    // 存储用户电话
    tel: '',
    // 已售数量
    sell: 0
  },

  // 数量加
  handleAdd() {
    this.setData({
      nums: ++this.data.nums,
      totalPrice: this.data.nums * this.data.unitPrice
    })
  },

  // 数量减 reduce
  handleRed() {
    let res = this.data.nums > 0 ? --this.data.nums : '0'
    this.setData({
      nums: res,
      totalPrice: res * this.data.unitPrice
    })
  },

  // 获取openid,调用云函数
  onGetOpenid: function () {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.log(err)
      }
    })
    return true
  },

  // 表单提交操作
  formSubmit(e) {
    if (this.data.nums < 3) {
      wx.showToast({
        title: '至少3件商品起订,请重新选择或返回',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.nums > 50) {
      wx.showToast({
        title: '至多单个商品订购数量不超过50件',
        icon: 'none',
        duration: 2000
      })
    } else if (e.detail.value.nums > this.data.detail[0].count) {
      wx.showToast({
        title: '所剩库存不足,请重新选择数量',
        icon: 'none',
        duration: 1000
      })
    } else {
      // 防止重复提交订单信息
      setTimeout(() => {
        this.setData({
          btn_flag: true
        })
      }, 500)
      // 获取用户名(用于订单动态展示)
      const db = wx.cloud.database()
      db.collection('counters').where({
        _openid: app.globalData.openid
      }).get().then(res => {
        // db.collection('historyOrder').add({
        //   data: {
        //     openid: res.data[0]._openid,
        //     meta: {
        //       user: '',
        //       pid: '',
        //       pName: '',
        //       nums: '',
        //     }
        //   }
        // }).then(res => console.log(res)).catch(err => console.log(err))
        this.setData({
          userName: res.data[0].userName,
          tel: res.data[0].tel,
        }, () => {
          // 根据产品id获取相关信息用于填充订单信息
          const id = this.data.proId
          db.collection('products').where({
            pid: id
          }).get().then(res => {
            let nums = Number(e.detail.value.nums)
            // 设置orders订单数据
            db.collection('orders').add({
              data: {
                user: this.data.userName,
                tel: this.data.tel,
                pName: res.data[0].name,
                pic_url: res.data[0].src,
                price: res.data[0].price,
                pid: res.data[0].pid,
                status: '下单成功',
                nums: nums,
                // timer: util.formatTime(new Date()),
                timer: new Date().getTime(),
                flag_sub: false
              }
              // 提交成功的操作
            }).then(res => {
              var that = this
              wx.showModal({
                cancelColor: '#8a8a8a',
                title: '提示',
                content: `您选择了${this.data.nums}件产品,请点击确认提交或取消`,
                success(res_) {
                  if (res_.confirm) {
                    wx.reLaunch({
                      url: `../../pages/home/home?id=${res._id}`,
                    })
                  } else if (res_.cancel) {
                    that.setData({
                      btn_flag: false
                    })
                  }
                }
              })
              // 失败的捕获
            }).catch(err => {
              wx.showToast({
                title: '提交失败,请稍后再试',
                icon: 'none',
                duration: 2000
              })
              console.log(err)
            })
          })
        })
      }).catch(err => {
        // 捕获获取用户失败的回调
        console.log(`捕获获取用户失败的回调${err}`)
      })
    }
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 调用函数获取openid
    if (!app.globalData.openid) {
      this.onGetOpenid()
    }
    // 获取已售商品数量 (费了)
    // let id_orders = Number(options.id)
    // let that = this
    // getSell(id_orders, that)
    // 获取商品数据
    const id = parseInt(options.id)
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('products').where({
      pid: id
    }).get().then(res => {
      // 判断是否禁用提交订单按钮
      if (res.data[0].count <= 0) {
        this.setData({
          btn_flag: true
        })
      }
      // 设置页面渲染的数据
      this.setData({
        detail: res.data,
        unitPrice: res.data[0].price,
        proId: res.data[0].pid
      })
    })
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},

  // 生命周期函数--监听页面显示
  onShow: function () {},

  // 生命周期函数--监听页面隐藏
  onHide: function () {},

  // 生命周期函数--监听页面卸载
  onUnload: function () {},

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
})