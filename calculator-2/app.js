App({
  onLaunch: function () {
    console.log('小程序启动');
  },
  onShow: function () {
    console.log('小程序显示');
  },
  onHide: function () {
    console.log('小程序隐藏');
  },
  globalData: {
    userInfo: null
  }
})
