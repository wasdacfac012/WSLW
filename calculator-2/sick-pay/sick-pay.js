

Page({
  data: {
    y: null,
    d: null,
    pm: null,
    result: null,
    showDetail: false,
    detailProcess: '',

  },


  calculate: function() {
    const { y, d, pm } = this.data;
    if (y === null || d === null || pm === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const yVal = parseFloat(y) || 0;
    const dVal = parseFloat(d) || 0;
    const pmVal = parseFloat(pm) || 0;

    const dailyMinWage = (pmVal * 8) / 21.75;
    const actualDays = Math.min(yVal, dVal);
    const result = actualDays * dailyMinWage;

    // 生成详细计算过程
    const detailProcess = `计算公式：病假工资 = min(病假天数, 疾病休假天数) × 日最低工资
其中：日最低工资 = (最低月工资标准 × 8小时) ÷ 21.75天

输入数据：
• 病假天数(Y)：${yVal} 天
• 疾病休假天数(D)：${dVal} 天
• 最低月工资标准(Pm)：${pmVal} 元

计算过程：
第一步：计算日最低工资
日最低工资 = (${pmVal} × 8) ÷ 21.75
           = ${(pmVal * 8).toFixed(2)} ÷ 21.75
           = ${dailyMinWage.toFixed(2)} 元/天

第二步：确定病假工资计算天数
实际病假天数 = min(${yVal}, ${dVal}) = ${actualDays} 天

第三步：计算病假工资
病假工资 = ${actualDays} × ${dailyMinWage.toFixed(2)}
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
    
    const { y, d, pm } = this.data;
    const yVal = parseFloat(y) || 0;
    const dVal = parseFloat(d) || 0;
    const pmVal = parseFloat(pm) || 0;
    
    const dailyMinWage = (pmVal ) / 21.75;
    const actualDays = Math.min(yVal, dVal);
    
    const resultText = `【病假工资计算】
    
计算公式：病假工资 = min(病假天数, 疾病休假天数) × 日最低工资
其中：日最低工资 = (最低月工资标准 ) ÷ 21.75天

输入数据：
• 病假天数(Y)：${yVal} 天
• 疾病休假天数(D)：${dVal} 天
• 最低月工资标准(Pm)：${pmVal} 元

计算过程：
第一步：计算日最低工资
日最低工资 = (${pmVal} ) ÷ 21.75
           = ${(pmVal ).toFixed(2)} ÷ 21.75
           = ${dailyMinWage.toFixed(2)} 元/天

第二步：确定病假工资计算天数
实际病假天数 = min(${yVal}, ${dVal}) = ${actualDays} 天

第三步：计算病假工资
病假工资 = ${actualDays} × ${dailyMinWage.toFixed(2)}
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
    const shareTitle = result ? `我用病假工资计算器算出了${result}元，快来试试吧！` : '病假工资计算器，快来计算你的病假工资！';
    
    return {
      title: shareTitle,
      path: '/sick-pay/sick-pay',
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
  },


 
})
