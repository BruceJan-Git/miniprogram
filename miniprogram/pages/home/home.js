// miniprogram/pages/home/home.js
import getPro from "../../modules/getPro";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meta: [{
        pid: 1,
        name: '古城百利包',
        src: '../../images/updata/chunnai.jpg',
        type: '纯牛奶',
        desc: '古城原味纯牛奶袋装整箱200ml*16袋百利包全脂灭菌乳',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        pid: 2,
        name: '古城枕奶包',
        src: '../../images/updata/zhennai.jpg',
        type: '纯牛奶',
        desc: '古城纯牛奶无菌枕古城奶220ml*16袋硬纸袋装整箱',
        count: 1000,
        sell: 900,
        overplus: 100
      },
      {
        pid: 3,
        name: '古城酸牛奶',
        src: '../../images/updata/suannaiDetail.jpg',
        type: '酸牛奶',
        desc: '古城乳酸菌酸牛奶饮料,古城酸奶发酵含乳饮品250ml*15',
        count: 1000,
        sell: 900,
        overplus: 100
      },
      {
        pid: 4,
        name: '古城奶粉400g装',
        src: '../../images/updata/naifen350.jpg',
        type: '奶粉',
        desc: '全脂加糖奶粉速溶牛奶粉400g散装山西特产成人青少年学生儿童',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        pid: 5,
        name: '古城奶粉350g散装',
        src: '../../images/updata/naifen350.jpg',
        type: '奶粉',
        desc: '古城奶粉成人全脂加糖独立装350g营养早餐',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        pid: 6,
        name: '古城无糖奶粉',
        src: '../../images/updata/naifenSuger.jpg',
        type: '奶粉',
        desc: '古城奶粉成人全脂无糖400g克烘焙甜品饮品店奶茶专用',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        pid: 7,
        name: '古城庆典',
        src: '../../images/updata/qingdian.jpg',
        type: '奶粉',
        desc: '古城纯牛奶整箱40年庆典青少年礼盒装全脂灭菌乳',
        count: 0,
        sell: 900,
        overplus: 100
      },
      {
        pid: 8,
        name: '古城三晋牧场',
        src: '../../images/updata/sanjin.jpg',
        type: '奶粉',
        desc: '古城纯牛奶整箱三晋牧场生牛乳250mlX12盒礼盒装 送礼',
        count: 0,
        sell: 900,
        overplus: 100
      }
    ],
  },

  /**
   * handleJump轮播图跳转
   */

  handleJump(e) {
    getPro(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})