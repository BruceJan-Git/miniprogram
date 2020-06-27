// miniprogram/pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: "order",
    stock: true,
    meta: [{
        name: '古城百利包',
        src: '../../images/updata/chunnai.jpg',
        type: '纯牛奶',
        desc: '古城原味纯牛奶袋装整箱200ml*16袋百利包全脂灭菌乳',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        name: '古城枕奶包',
        src: '../../images/updata/zhennai.jpg',
        type: '纯牛奶',
        desc: '古城纯牛奶无菌枕古城奶220ml*16袋硬纸袋装整箱',
        count: 1000,
        sell: 900,
        overplus: 100
      },
      {
        name: '古城酸牛奶',
        src: '../../images/updata/suannaiDetail.jpg',
        type: '酸牛奶',
        desc: '古城乳酸菌酸牛奶饮料,古城酸奶发酵含乳饮品250ml*15',
        count: 1000,
        sell: 900,
        overplus: 100
      },
      {
        name: '古城奶粉400g装',
        src: '../../images/updata/naifen350.jpg',
        type: '奶粉',
        desc: '全脂加糖奶粉速溶牛奶粉400g散装山西特产成人青少年学生儿童',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        name: '古城奶粉350g散装',
        src: '../../images/updata/naifen350.jpg',
        type: '奶粉',
        desc: '古城奶粉成人全脂加糖独立装350g营养早餐',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        name: '古城无糖奶粉',
        src: '../../images/updata/naifenSuger.jpg',
        type: '奶粉',
        desc: '古城奶粉成人全脂无糖400g克烘焙甜品饮品店奶茶专用',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        name: '古城庆典',
        src: '../../images/updata/qingdian.jpg',
        type: '奶粉',
        desc: '古城纯牛奶整箱40年庆典青少年礼盒装全脂灭菌乳',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        name: '古城三晋牧场',
        src: '../../images/updata/sanjin.jpg',
        type: '奶粉',
        desc: '古城纯牛奶整箱三晋牧场生牛乳250mlX12盒礼盒装 送礼',
        count: 0,
        sell: 900,
        overplus: 100
      }
    ],
    currtab: 1,
    swipertab: [{
      name: '已选择',
      index: 0
    }, {
      name: '已确认',
      index: 1
    }],

  },

  loadData() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    setTimeout(() => {
      wx.hideLoading({
        success: () => {
          console.log('hideLoading')
        },
      })
    }, 2000)
  },

  handTab(e) {
    let index = e.target.dataset.index
    this.setData({
      currentTab: index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 函数参数为对象
    // wx.request()
    this.loadData()
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDeviceInfo()
    this.orderShow()
  },

  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
   * @Explain：选项卡点击切换
   */
  tabSwitch: function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },

  tabChange: function (e) {
    this.setData({
      currtab: e.detail.current
    })
    this.orderShow()
  },

  orderShow: function () {
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.alreadyShow()
        break
      case 1:
        that.waitPayShow()
        break
      case 2:
        that.lostShow()
        break
    }
  },
  alreadyShow: function () {
    this.setData({
      alreadyOrder: [{
        name: "古城百利包",
        state: "已选择",
        time: "2018-09-30",
        status: "待确认",
        nums: "5件",
        url: "../../images/updata/chunnai.jpg",
        money: "25",
      }]
    })
  },

  waitPayShow: function () {
    this.setData({
      waitPayOrder: [{
        name: "跃动体育运动俱乐部(圆明园店)",
        state: "待确认",
        time: "2018-10-14 14:00-16:00",
        status: "未开始",
        url: "../../images/bad1.jpg",
        money: "186"
      }],
    })
  },

  lostShow: function () {
    this.setData({
      lostOrder: [{
        name: "跃动体育运动俱乐部(圆明园店)",
        state: "已取消",
        time: "2018-10-4 10:00-12:00",
        status: "未开始",
        url: "../../images/bad1.jpg",
        money: "122"
      }],
    })
  },

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
    // 这里就可以调用后台接口
    console.log('下拉刷新')
    this.loadData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面滚动到了底部...')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})