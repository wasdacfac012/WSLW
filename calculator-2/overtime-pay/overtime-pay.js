Page({
  data: {
    regions: [
      '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
      '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
      '浙江省', '安徽省', '福建省', '江西省', '山东省',
      '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
      '海南省', '重庆市', '四川省', '贵州省', '云南省',
      '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
      '新疆维吾尔自治区'
    ],
    regionIndex: 0,
    selectedSystem: null
  },

  bindRegionChange: function(e) {
    this.setData({
      regionIndex: e.detail.value
    });
  },

  selectWorkSystem: function(e) {
    var system = e.currentTarget.dataset.system;
    this.setData({
      selectedSystem: system
    });
  },

  navigateToCalculator: function() {
    var selectedSystem = this.data.selectedSystem;
    if (selectedSystem === 'standard') {
      wx.navigateTo({
        url: '/standard-overtime/standard-overtime'
      });
    } else if (selectedSystem === 'comprehensive') {
      wx.navigateTo({
        url: '/comprehensive-overtime/comprehensive-overtime'
      });
    }
  },

  // 分享功能
  onShareAppMessage: function () {
    return {
      title: '加班费计算器 - 快来计算你的加班费！',
      path: '/overtime-pay/overtime-pay',
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
});
