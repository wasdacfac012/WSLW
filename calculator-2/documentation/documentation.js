// documentation.js
Page({
  data: {
    imageUrl: '/images/lct.jpg'
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  // 预览图片
  previewImage: function() {
    wx.previewImage({
      current: this.data.imageUrl, // 当前显示图片的链接
      urls: [this.data.imageUrl] // 需要预览的图片链接列表
    })
  }
})
