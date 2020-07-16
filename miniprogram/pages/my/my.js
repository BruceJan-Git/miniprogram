//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    flag: true,
    // activity: ['送友人', '青山横北郭，白水绕东城。', '此地一为别，孤蓬万里征。', '浮云游子意，落日故人情。', '挥手自兹去，萧萧班马鸣。']
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    this.onGetOpenid()
    // this.onLoadData()
    this.onGetActivity()
  },

  // 调用云函数
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openid: res.result.openid
        }, res => {
          this.onLoadData()
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  onLoadData() {
    const arr = ["古城百利包", "古城枕奶包", "古城盒纯", "古城庆典", "古城三晋牧场", "古城金牌纯牛奶", "古城奶粉400g装", "古城奶粉350g散装", "古城无糖奶粉", "古城酸牛奶", "古城恋果乳"]
    const db = wx.cloud.database()
    arr.forEach(item => {
      db.collection('historyOrder').where({
        openid: this.data.openid
      }).get().then(res => {
        let newArr = res.data[0].meta.filter((item_ => {
          return item_.pName === item
        }))
        if (newArr[0]) {
          if (newArr[0].name === 'blb') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'znb') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'hc') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'qd') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'sjmc') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'jp') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'nf400g') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'nf350g') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'nfwt') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'snn') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          } else if (newArr[0].name === 'lgr') {
            let total = 0
            for (let i = 0; i < newArr.length; i++) {
              total += newArr[i].nums
            }
            this.setData({
              [newArr[0].name]: total
            })
          }
        }
      }).catch(err => console.log(err))
    })
  },

  onGetActivity() {
    const db = wx.cloud.database()
    db.collection("activity").where({
      _openid: 'activity'
    }).get().then(res => {
      this.setData({
        activity: res.data[0].activity
      })
    }).catch(err => console.log(err))
  },

  // 点击展开/收起
  handleToggle() {
    if (this.data.flag) {
      this.setData({
        flag: false
      })
    } else {
      this.setData({
        flag: true
      })
    }
  },

  // 反馈事件
  bindFormSubmit: function (e) {
    const db = wx.cloud.database()
    console.log(this.data.openid)
    db.collection('counters').where({
      _openid: this.data.openid,
    }).get().then(res => {
      if (e.detail.value.textarea.trim()) {
        db.collection('feedBack').add({
            data: {
              user: res.data[0].userName,
              msg: e.detail.value.textarea,
              nums: 1
            }
          })
          .then(res => {
            let this_ = this
            if (res.errMsg === 'collection.add:ok') {
              wx.showToast({
                title: '反馈成功',
                duration: 2000,
                success() {
                  this_.setData({
                    sug: ''
                  })
                }
              })
            }
          })
      } else {
        wx.showToast({
          title: '请输入内容后提交',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

})