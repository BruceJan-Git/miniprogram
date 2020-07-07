/**
 * todo: 
 * 
 * doing:
 * 
 * done:
 * 
 */
const app = getApp()

Page({
  // 页面初始数据
  data: {
    reg_btn: false,
    openid: '',
    memoryId: '',
    isShow: true
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
    return true
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    if (options.forgetPaw == 'userPaw') {
      this.setData({
        isShow: false
      })
    } else {
      // 注册操作,获取用户id
      wx.showModal({
        title: '提示',
        content: '注册前请同意小程序获取您的ID身份标识,请允许并注册',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            this.onGetOpenid()
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.redirectTo({
              url: '../../pages/login/login',
            })
          }
        }
      })
    }
  },

  // 是否禁用注册按钮
  handleChange(e) {
    if (e.detail.value[0] === undefined) {
      this.setData({
        reg_btn: true
      })
    } else {
      this.setData({
        reg_btn: false
      })
    }
  },

  // 校验手机号格式
  handleCheckTel(e) {
    if (!(/^1[34578]\d{9}$/.test(e.detail.value.tel || e.detail.value))) {
      wx.showToast({
        title: '手机格式有误',
        // duration: 2000,
        icon: 'none',
      });
      return false
    } else {
      return true;
    }
  },

  //注册事件
  submit(e) {
    // 获取数据库引用
    const db = wx.cloud.database();
    const userListDB = db.collection('counters');
    // 获取表单信息
    let userName = e.detail.value.userName.trim()
    let tel = e.detail.value.tel.trim()
    let paw = e.detail.value.paw.trim()
    // 非空验证
    if (userName !== '' && tel !== '' && paw !== '') {
      // 手机号格式验证
      if (this.handleCheckTel(e)) {
        userListDB.where({
          // tel: tel,
          _openid: this.data.openid
        }).get().then(res => {
          // console.log(res)
          // return
          let res_search = res.data[0]
          // 查询结果/如果为空,则进行注册(添加数据操作)
          if (res_search === undefined) {
            userListDB.add({
              data: {
                userName: userName,
                tel: tel,
                paw: paw
              }
            }).then(res => {
              this.setData({
                memoryId: res._id
              })
              wx.showToast({
                title: '注册成功',
                mask: true,
                success: () => {
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '../../pages/login/login'
                    })
                  }, 2000);
                },
                fail: (res) => {
                  wx.showToast({
                    title: `注册失败,请稍后再试,error${res}`
                  })
                }
              })
            })
            // 如果不为空,则和当前数据进行比较,判断为修改密码操作
          } else {
            if (res_search.tel === tel) {
              wx.showModal({
                title: '提示',
                content: '您已注册，确定更改商户或密码吗？',
                success: (res) => {
                  if (res.confirm) {
                    // 修改密码操作
                    userListDB.doc(res_search._id).update({
                      data: {
                        userName: userName,
                        tel: tel,
                        paw: paw
                      }
                    }).then(res => {
                      wx.showToast({
                        title: '更新成功',
                        mask: true,
                        success: (res) => {
                          setTimeout(() => {
                            wx.redirectTo({
                              url: '../../pages/login/login'
                            })
                          }, 1000);
                        },
                        fail: (res) => {
                          wx.showToast({
                            title: `注册失败,请稍后再试,error${res}`
                          })
                        },
                      })
                    }).catch(err => {
                      wx.showToast({
                        title: err,
                        icon: 'none'
                      })
                    })
                  } else {
                    wx.showToast({
                      title: '未进行任何修改操作',
                      icon: 'none'
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '每个微信号仅可注册一个订单账户,请输入您注册时使用的手机号,点击注册,找回账户和密码',
                icon: 'none',
                duration: 3000
              })
            }
          }
        })
      } else {
        console.log('我弟测出来的bug')
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '商户名称,用户名,密码为必填项',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
})