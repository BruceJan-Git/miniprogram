//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    history: {}
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

    this.onLoadData()
  },

  // 调用云函数
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openid: res.result.onGetOpenid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  onGetHistoryOrder(production) {
    const db = wx.cloud.database()
    db.collection('historyOrder').get().then(res => {
      let newArr = res.data[0].meta.filter((item => {
        return item.pName === production
      }))
      if (newArr[0]) {
        let total = 0
        let arr = [];
        let obj = {}
        for (let i = 0; i < newArr.length; i++) {
          total += newArr[i].nums
        }
        // obj = {
        //   [newArr[0].pName]: total
        // }
        // console.log(obj)

        // arr.push(obj)

        // arr.push({
        //   [newArr[0].pName]: total
        // })

        this.setData({
          [newArr[0].pName]: total

          // result: { // 这里的属性不能是固定的?
          //   [newArr[0].pName]: total
          // }
        }, () => console.log(this.data.古城奶粉400g装)) // 居然能输出值,但是不能动态渲染
      }
    }).catch(err => console.log(err))
  },

  onLoadData() {
    const arr = ["古城百利包", "古城枕奶包", "古城盒纯", "古城庆典", "古城三晋牧场", "古城金牌纯牛奶", "古城奶粉400g装", "古城奶粉350g散装", "古城无糖奶粉", "古城酸牛奶", "古城恋果乳"]
    arr.forEach(item => {
      this.onGetHistoryOrder(item)
    })
  }

})