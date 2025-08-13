

Page({
  data: {
    a: null,
    c: null,
    result: null,
    showDetail: false,
    detailProcess: '',
  },


  calculate: function() {
    const { a, c } = this.data;
    if (a === null || c === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const aVal = parseFloat(a) || 0;
    const cVal = parseFloat(c) || 0;

    const minBase = 0.6 * cVal;
    const maxBase = 3 * cVal;
    const result = Math.max(minBase, Math.min(aVal, maxBase));

    // 生成详细计算过程
    const detailProcess = `计算公式：社保基数 = max(最低基数, min(实际工资, 最高基数))
其中：最低基数 = 上年度平均工资 × 60%, 最高基数 = 上年度平均工资 × 300%

输入数据：
• 实际工资收入(A)：${aVal} 元
• 上年度平均工资(C)：${cVal} 元

计算过程：
第一步：计算最低和最高基数
最低基数 = ${cVal} × 60% = ${minBase.toFixed(2)} 元
最高基数 = ${cVal} × 300% = ${maxBase.toFixed(2)} 元

第二步：确定社保基数
实际工资：${aVal} 元
最低基数：${minBase.toFixed(2)} 元  
最高基数：${maxBase.toFixed(2)} 元

社保基数 = max(${minBase.toFixed(2)}, min(${aVal}, ${maxBase.toFixed(2)}))
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
    
    const { a, c } = this.data;
    const aVal = parseFloat(a) || 0;
    const cVal = parseFloat(c) || 0;
    const minBase = 0.6 * cVal;
    const maxBase = 3 * cVal;
    
    const resultText = `【社保公积金基数计算】
    
计算公式：社保基数 = max(最低基数, min(实际工资, 最高基数))
其中：最低基数 = 上年度平均工资 × 60%, 最高基数 = 上年度平均工资 × 300%

输入数据：
• 实际工资收入(A)：${aVal} 元
• 上年度平均工资(C)：${cVal} 元

计算过程：
第一步：计算最低和最高基数
最低基数 = ${cVal} × 60% = ${minBase.toFixed(2)} 元
最高基数 = ${cVal} × 300% = ${maxBase.toFixed(2)} 元

第二步：确定社保基数
实际工资：${aVal} 元
最低基数：${minBase.toFixed(2)} 元  
最高基数：${maxBase.toFixed(2)} 元

社保基数 = max(${minBase.toFixed(2)}, min(${aVal}, ${maxBase.toFixed(2)}))
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
    const shareTitle = result ? `我用社保公积金基数计算器算出了${result}元，快来试试吧！` : '社保公积金基数计算器，快来计算你的缴费基数！';
    
    return {
      title: shareTitle,
      path: '/social-base/social-base',
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
