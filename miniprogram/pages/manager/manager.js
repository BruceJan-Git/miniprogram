Page({
  // 页面的初始数据
  data: {
    // 该数组为云函数查询字段
    productions: ['未选择', '古城百利包', '古城枕奶包', '古城盒纯', '古城庆典', '古城三晋牧场', '古城金牌纯牛奶', '古城奶粉400g装', '古城奶粉350g散装', '古城无糖奶粉', '古城酸牛奶', '古城恋果乳'],
    index: 0,
    index_: 0,
    status: null,
  },

  // picker绑定库存数量变更
  bindStoreChange(e) {
    this.setData({
      index: e.detail.value,
      storePro: this.data.productions[e.detail.value]
    })
  },

  // picker绑定订单状态变更
  bindOrderChange(e) {
    this.setData({
      index_: e.detail.value,
      orderPro: this.data.productions[e.detail.value]
    })
  },

  // 提交入库产品数量
  submit_store(e) {
    let stoNums = Number(e.detail.value.stoNums)
    let selNums = Number(e.detail.value.selNums)
    if (stoNums !== undefined && selNums !== undefined) {
      this.setData({
        stoNums: stoNums,
        selNums: selNums
      })
    }
    if (this.data.stoNums !== undefined && this.data.selNums !== undefined && !!this.data.storePro) {
      this.handleStore(stoNums, selNums)
    } else {
      wx.showToast({
        title: '请输入数据后提交',
        icon: 'none'
      })
    }
  },

  // 库存处理(调用云函数)
  handleStore(stoNums, selNums) {
    let this_ = this
    wx.cloud.callFunction({
      name: 'manageStore',
      data: {
        name: this.data.storePro,
        count: stoNums,
        sell: selNums
      }
    }).then(res => {
      wx.showModal({
        cancelColor: '#ccc',
        content: `入库${this.data.storePro}${this.data.stoNums}件`,
        success(res_) {
          if (res_.confirm) {
            if (res.result.errMsg === 'collection.update:ok') {
              wx.showToast({
                title: '入库数据提交成功',
                duration: 2000,
                success() {
                  this_.reset()
                }
              })
            } else {
              wx.showToast({
                title: '库存更新失败',
                icon: 'none'
              })
            }
          } else if (res_.cancel) {
            wx.showToast({
              title: '取消提交',
              icon: 'none'
            })
          }
        }
      })
    }).catch(err => console.log(err))
  },

  // 提交订单状态
  submit_orders(e) {
    let status = e.detail.value.status
    if (status && this.data.orderPro) {
      this.setData({
        status: status
      })
      this.handleOrder()
    } else {
      wx.showToast({
        title: '请选择产品并输入订单处状态',
        icon: 'none'
      })
    }
  },

  // 订单处理
  handleOrder() {
    let this_ = this
    wx.cloud.callFunction({
      name: 'manageOrder',
      data: {
        status: this.data.status,
        name: this.data.orderPro
      }
    }).then(res => {
      wx.showModal({
        cancelColor: '#ccc',
        content: `确认更新客户端订单状态吗?`,
        success(res_) {
          if (res_.confirm) {
            if (res.result.stats.updated == 1) {
              wx.showToast({
                title: '客户端订单更新成功',
                duration: 2000,
                success() {
                  this_.reset()
                }
              })
            } else {
              wx.showToast({
                title: '无该产品订单',
                icon: 'none',
                success() {
                  this_.reset()
                }
              })
            }
          } else if (res_.cancel) {
            wx.showToast({
              title: '取消提交',
              icon: 'none'
            })
          }
        }
      })
    })
  },

  // 清空数据
  empty_data() {
    this.setData({
      index: 0,
      index_: 0,
    })
  },

  reset() {
    this.empty_data()
  },

  // 订单清空
  submit_empty() {
    let this_ = this
    this.statistic()
    wx.showModal({
      cancelColor: 'cancelColor',
      content: '确定清空所有订单数据吗?此操作将删除客户端所有订单数据',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'managerOrderEmpty',
            data: {}
          }).then(res => {
            if (res.result.errMsg === 'collection.remove:ok') {
              wx.showToast({
                title: '清空成功',
              })
              this_.onLoadOrder()
            }
          }).catch(err => {
            wx.showToast({
              title: '清空失败或暂无订单',
              icon: 'none'
            })
          })
        }
      }
    })
  },

  // 获取所有订单
  onLoadOrder() {
    const db = wx.cloud.database()
    db.collection('orders')
      .where({})
      .get()
      .then(res => {
        this.setData({
          order_data: res.data
        })
      })
      .catch(err => {
        wx.showToast({
          title: `订单获取失败 ${err}`,
          icon: 'none'
        })
      })
  },

  // 删除单个订单事件
  handleDelOrder(e) {
    let _id = e.currentTarget.dataset._id
    let this_ = this
    const db = wx.cloud.database()
    wx.showModal({
      content: '确认删除该订单吗?',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
              name: 'managerOrderDel',
              data: {
                _id: _id
              }
            })
            .then(res => {
              if (res.result.stats.removed === 1) {
                wx.showToast({
                  title: '删除成功',
                })
                this_.onLoadOrder()
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              }
            })

          db.collection('orders').where({
              _id: _id
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

  // 更新单个订单事件
  handleUpOrder(e) {
    let _id = e.currentTarget.dataset._id
    let this_ = this
    wx.showModal({
      content: '确认更新该订单吗?',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
              name: 'managerOrderUpdata',
              data: {
                _id: _id
              }
            })
            .then(res => {
              if (res.result.errMsg === 'collection.update:ok') {
                wx.showToast({
                  title: '更新成功',
                })
                this_.onLoadOrder()
              }
            })
            .catch(err => {
              wx.showToast({
                title: `更新失败:${err}`,
              })
            })
        } else if (res.cancel) {
          wx.showToast({
            title: '取消更新',
            icon: 'none'
          })
        }
      }
    })
  },

  // 添加历史订单(用于商户订单数据统计)
  statistic() {
    const db = wx.cloud.database()
    db.collection('orders').where({
        status: '正在配送...'
      })
      .get()
      .then(res => {
        db.collection('historyOrder').where({}).get().then(res_ => {
          let result = [];
          let id;
          for (let i = 0; i < res_.data.length; i++) {
            res.data.map((item) => {
              if (item._openid === res_.data[i].openid) {
                result.push(item)
                id = res_.data[i]._id
                return result, id
              }
            })
          }
          wx.cloud.callFunction({
              name: 'managerHistory',
              data: {
                id: id,
                arr: result
              }
            })
            .then(res => {
              console.log(res)
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
  },

  getSug() {
    const db = wx.cloud.database()
    db.collection('feedBack').get().then(res => {
      this.setData({
        sug: res.data
      })
    }).catch(err => console.log(err))
  },

  handleClearSug() {
    wx.cloud.callFunction({
      name: 'clearSug',
      data: {}
    }).then(res => {
      console.log(res)
      this.onLoadOrder()
    }).catch(err => console.log(err))
  },

  formSubmit(e) {
    let arr = []
    if (e.detail.value.roule1.trim() || e.detail.value.roule2.trim() || e.detail.value.roule3.trim() || e.detail.value.roule4.trim() || e.detail.value.roule5.trim()) {
      for (const key in e.detail.value) {
        if (e.detail.value.hasOwnProperty(key)) {
          const element = e.detail.value[key];
          if (element) {
            arr.push(element)
          }
        }
      }
      wx.cloud.callFunction({
        name: 'addBill',
        data: {
          arr: arr
        }
      }).then(res => {
        if (res.result.errMsg === 'collection.update:ok') {
          wx.showToast({
            title: '提交成功',
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入内容再提交',
        icon: 'none'
      })
    }
  },

  handleEmptyBill() {
    wx.cloud.callFunction({
      name: 'emptyBill',
      data: {}
    }).then(res => {
      if(res.result.errMsg === 'collection.update:ok') {
        wx.showToast({
          title: '告示清空成功',
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '清空失败' + err,
      })
    })
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.onLoadOrder()
    this.getSug()
  },

})