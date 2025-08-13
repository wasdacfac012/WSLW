Page({
  data: {
    p: null,
    h1: null,
    h2: null,
    h3: null,
    result: null,
    showDetail: false,
    detailProcess: ''
  },

  bindKeyInput: function(e) {
    var field = e.currentTarget.dataset.field;
    var newData = {};
    newData[field] = e.detail.value;
    this.setData(newData);
  },

  calculate: function() {
    var p = this.data.p;
    var h1 = this.data.h1;
    var h2 = this.data.h2;
    var h3 = this.data.h3;
    if (p === null || h1 === null || h2 === null || h3 === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    var pVal = parseFloat(p) || 0;
    var h1Val = parseFloat(h1) || 0;
    var h2Val = parseFloat(h2) || 0;
    var h3Val = parseFloat(h3) || 0;
    
    // 标准工时加班费计算公式：
    // 加班费 = 工作日加班费 + 休息日加班费 + 法定节假日加班费
    // 工作日加班费 = H1 * 1.5 * P
    // 休息日加班费 = H2 * 2.0 * P
    // 法定节假日加班费 = H3 * 3.0 * P
    const workdayOvertime = h1Val * 1.5 * pVal;
    const restOvertime = h2Val * 2.0 * pVal;
    const holidayOvertime = h3Val * 3.0 * pVal;
    const result = workdayOvertime + restOvertime + holidayOvertime;
    
    // 生成详细计算过程
    const detailProcess = `计算公式：加班费 = 工作日加班费 + 休息日加班费 + 法定节假日加班费

输入数据：
• 工资基数(P)：${pVal} 元/小时
• 工作日加班(H1)：${h1Val} 小时
• 休息日加班(H2)：${h2Val} 小时
• 法定节假日加班(H3)：${h3Val} 小时

计算过程：
第一步：确定各部分加班费系数
- 工作日加班系数：1.5倍
- 休息日加班系数：2.0倍
- 法定节假日加班系数：3.0倍

第二步：分别计算各部分加班费
- 工作日加班费 = ${h1Val} × 1.5 × ${pVal} = ${workdayOvertime.toFixed(2)} 元
- 休息日加班费 = ${h2Val} × 2.0 × ${pVal} = ${restOvertime.toFixed(2)} 元
- 法定节假日加班费 = ${h3Val} × 3.0 × ${pVal} = ${holidayOvertime.toFixed(2)} 元

第三步：计算总加班费
加班费 = ${workdayOvertime.toFixed(2)} + ${restOvertime.toFixed(2)} + ${holidayOvertime.toFixed(2)} = ${result.toFixed(2)} 元`;
    
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
    
    const { p, h1, h2, h3 } = this.data;
    const pVal = parseFloat(p) || 0;
    const h1Val = parseFloat(h1) || 0;
    const h2Val = parseFloat(h2) || 0;
    const h3Val = parseFloat(h3) || 0;
    
    const workdayOvertime = h1Val * 1.5 * pVal;
    const restOvertime = h2Val * 2.0 * pVal;
    const holidayOvertime = h3Val * 3.0 * pVal;
    
    const resultText = `【标准工时加班费计算】
    
计算公式：加班费 = 工作日加班费 + 休息日加班费 + 法定节假日加班费

输入数据：
• 工资基数(P)：${pVal} 元/小时
• 工作日加班(H1)：${h1Val} 小时
• 休息日加班(H2)：${h2Val} 小时
• 法定节假日加班(H3)：${h3Val} 小时

计算过程：
第一步：确定各部分加班费系数
- 工作日加班系数：1.5倍
- 休息日加班系数：2.0倍
- 法定节假日加班系数：3.0倍

第二步：分别计算各部分加班费
- 工作日加班费 = ${h1Val} × 1.5 × ${pVal} = ${workdayOvertime.toFixed(2)} 元
- 休息日加班费 = ${h2Val} × 2.0 × ${pVal} = ${restOvertime.toFixed(2)} 元
- 法定节假日加班费 = ${h3Val} × 3.0 × ${pVal} = ${holidayOvertime.toFixed(2)} 元

第三步：计算总加班费
加班费 = ${workdayOvertime.toFixed(2)} + ${restOvertime.toFixed(2)} + ${holidayOvertime.toFixed(2)} = ${this.data.result} 元

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
    const shareTitle = result ? `我用标准工时加班费计算器算出了${result}元，快来试试吧！` : '标准工时加班费计算器，快来计算你的加班费！';
    
    return {
      title: shareTitle,
      path: '/standard-overtime/standard-overtime',
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
