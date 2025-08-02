Page({
  data: {
    h1: null,
    h2: null,
    p: null,
    result: null,
    showDetail: false,
    detailProcess: ''
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  calculate: function() {
    const { h1, h2, p } = this.data;
    if (h1 === null || h2 === null || p === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const h1Val = parseFloat(h1) || 0;
    const h2Val = parseFloat(h2) || 0;
    const pVal = parseFloat(p) || 0;
    
    const result = 1.5 * h1Val * pVal + 3 * h2Val * pVal;
    
    // 生成详细计算过程
    const detailProcess = `计算公式：加班费 = (平时延长工作时间 × 1.5 + 法定节假日工作时间 × 3) × 工资基数

输入数据：
• 平时延长工作时间(H1)：${h1Val} 小时
• 法定节假日工作时间(H2)：${h2Val} 小时
• 工资基数(P)：${pVal} 元/小时

计算过程：
第一步：确定加班费系数
- 平时延长工作时间系数：1.5倍
- 法定节假日工作时间系数：3倍

第二步：计算总加班费
加班费 = (${h1Val} × 1.5 + ${h2Val} × 3) × ${pVal}
       = (${(h1Val * 1.5).toFixed(2)} + ${(h2Val * 3).toFixed(2)}) × ${pVal}
       = ${(h1Val * 1.5 + h2Val * 3).toFixed(2)} × ${pVal}
       = ${result.toFixed(2)} 元`;
    
    this.setData({
      result: result.toFixed(2),
      detailProcess: detailProcess,
      showDetail: false
    });
  },

  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  copyResult: function() {
    if (this.data.result === null) {
      wx.showToast({
        title: '没有计算结果可复制',
        icon: 'none'
      });
      return;
    }
    
    const { h1, h2, p } = this.data;
    const h1Val = parseFloat(h1) || 0;
    const h2Val = parseFloat(h2) || 0;
    const pVal = parseFloat(p) || 0;
    
    const resultText = `【综合工时加班费计算】
    
计算公式：加班费 = (平时延长工作时间 × 1.5 + 法定节假日工作时间 × 3) × 工资基数

输入数据：
• 平时延长工作时间(H1)：${h1Val} 小时
• 法定节假日工作时间(H2)：${h2Val} 小时
• 工资基数(P)：${pVal} 元/小时

计算过程：
第一步：确定加班费系数
- 平时延长工作时间系数：1.5倍
- 法定节假日工作时间系数：3倍

第二步：计算总加班费
加班费 = (${h1Val} × 1.5 + ${h2Val} × 3) × ${pVal}
       = (${(h1Val * 1.5).toFixed(2)} + ${(h2Val * 3).toFixed(2)}) × ${pVal}
       = ${(h1Val * 1.5 + h2Val * 3).toFixed(2)} × ${pVal}
       = ${this.data.result} 元

最终结果：${this.data.result} 元`;
    
    wx.setClipboardData({
      data: resultText,
      success: function() {
        wx.showToast({
          title: '详细计算过程已复制',
          icon: 'success'
        });
      },
      fail: function() {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 分享功能
  onShareAppMessage: function () {
    const { result } = this.data;
    const shareTitle = result ? `我用综合工时加班费计算器算出了${result}元，快来试试吧！` : '综合工时加班费计算器，快来计算你的加班费！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/comprehensive-overtime/comprehensive-overtime',
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
