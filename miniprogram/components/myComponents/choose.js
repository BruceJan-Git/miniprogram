// components/myComponents/choose.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    nums: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // sliderchange(e) {
    //   this.setData({
    //     nums: e.detail.value
    //   })
    // }
    handleRed() {
      this.setData({
        nums: this.nums--
      })
    },
    handleAdd() {
      this.setData({
        nums: this.nums++
      })
    }
  }
})