Component({
  behaviors: ['wx://form-field'],
  data: {
    value: ''
  },
  methods: {
    onChange: function (e) {
      this.setData({
        value: e.detail.value,
      })
    }
  }
})
