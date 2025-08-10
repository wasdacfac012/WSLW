Page({
  data: {
    calculators: [
      { name: '个人所得税计算器', url: '/individual-income-tax/individual-income-tax' },
      { name: '未休年假补偿', url: '/annual-leave-compensation/annual-leave-compensation' },
      { name: '双倍工资计算器', url: '/double-salary/double-salary' },
      { name: '税后工资', url: '/net-salary/net-salary' },
      { name: '经济赔偿金', url: '/severance-pay/severance-pay' },
      { name: '经济补偿金计算器', url: '/economic-bcj/economics-bcj' },
      { name: '病假工资', url: '/sick-pay/sick-pay' },
      { name: '社保公积金基数', url: '/social-base/social-base' },
      { name: '一次性工伤赔偿金', url: '/injury-compensation/injury-compensation' },
      { name: '一次性工亡赔偿金', url: '/death-compensation/death-compensation' },
   
      
      { name: '劳动仲裁/诉讼时效', url: '/labor-arbitration/labor-arbitration' },

    ]
  },

  navigateToCalculator: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  // 跳转到说明文档页面
  navigateToDocumentation: function() {
    wx.navigateTo({
      url: '/documentation/documentation'
    });
  },

  // 预览图片
  previewImage: function() {
    wx.previewImage({
      urls: ['/images/lct.jpg'] // 图片的相对路径
    });
  },

  // 分享功能
  onShareAppMessage: function () {
    return {
      title: '劳动法计算器大全 - 10个专业计算工具，快来试试吧！',
      path: '/index',
      success: (res) => {
        console.log('分享成功', res);
        wx.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('分享失败', err);
        wx.showToast({
          title: '分享取消',
          icon: 'none'
        });
      }
    };
  }
})
