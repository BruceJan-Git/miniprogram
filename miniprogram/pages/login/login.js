/**
 * todo:
 * // 登录是否可以这样操作?
 * 
 * done:
 * // setData()函数清除定时任务,or全局变量存储定时函数,再清除定时函数?
 * // 跳转到首页 是否使用定时函数延长提示时间 => 使用,会有'setTimeout' handler警告(不在此js文件)
 */


const app = getApp()
let setTimer // 定义全局变量,用于存储定时函数or清除定时函数
Page({
  data: { // 初始化page对象数据
    flag: true,
  },

  onLoad: function (options) { // 页面加载(用于获取数据)
  },

  submit(e) { // 表单提交事件(登录/注册)
    let id = e.detail.target.id // 获取自定义属性(判断是点击登录还是注册)
    let user = e.detail.value.userName.trim() // 获取input文本框value
    let paw = e.detail.value.paw.trim() // 获取input文本框value
    const db = wx.cloud.database() // 获取数据库引用
    if (id === 'login' && user && paw) { // 非空/登录注册判断,查询数据库
      db.collection('counters').where({ // 查询是否注册过
        userName: user,
        paw: paw
      }).get().then(res => { // 获取查询结果
        if (res.data[0] && res.data[0].userName === user && res.data[0].paw === paw) { // 账户密码吻合,则进行跳转操作(登录是否可以这样操作?)
          wx.showToast({ // 跳转到首页 是否使用定时函数延长提示时间
            title: '登录成功',
            success: () => {
              setTimer = setTimeout(() => {
                wx.reLaunch({
                  url: '../../pages/home/home',
                })
              }, 1000)
            }
          })
        } else if (res.data[0] === undefined) { // 未查询到结果(是否为账户不存在/密码不正确)
          db.collection('counters').where({
            userName: user
          }).get().then(res => {
            if (res.data[0] === undefined) { // 未查询到数据,则进行注册引导
              wx.showModal({
                title: '提示',
                content: '该账户尚未注册,请点击确定前往注册,点击取消退出',
                success(res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '../../pages/register/register'
                    })
                  } else if (res.cancel) {}
                }
              })
            } else if (res.data[0].paw !== paw) { // 密码错误判断
              wx.showToast({
                title: '密码错误,请重新输入,或点击忘记密码,找回密码',
                icon: 'none',
                duration: 5000
              })
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    } else if (id === 'register') { // 若触发点击按钮,则跳转到注册页面
      wx.redirectTo({
        url: '../../pages/register/register',
      })
    } else { // 表单若有空数据处理(提示且不进行操作)
      wx.showToast({
        title: '请输入用户名或密码',
        icon: 'none',
        duration: 1000
      })
    }
  },

  onUnload() { // 页面卸载,清除定时函数
    clearTimeout(setTimer)
  }
})