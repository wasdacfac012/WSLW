Page({
  data: {
    k: null,
    p: null,
    result: null,
    showDetail: false,
    detailProcess: '',
    selectedDisabilityLevel: '',
    disabilityLevels: [
      '一级伤残 (本人工资×27个月)',
      '二级伤残 (本人工资×25个月)',
      '三级伤残 (本人工资×23个月)',
      '四级伤残 (本人工资×21个月)',
      '五级伤残 (本人工资×18个月)',
      '六级伤残 (本人工资×16个月)',
      '七级伤残 (本人工资×13个月)',
      '八级伤残 (本人工资×11个月)',
      '九级伤残 (本人工资×9个月)',
      '十级伤残 (本人工资×7个月)'
    ]
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  bindDisabilityChange: function(e) {
    const selectedIndex = e.detail.value;
    const coefficients = [27, 25, 23, 21, 18, 16, 13, 11, 9, 7];
    const kVal = selectedIndex + 1; // 伤残等级从1级到10级
    
    this.setData({
      k: kVal,
      selectedDisabilityLevel: this.data.disabilityLevels[selectedIndex]
    });
  },

  calculate: function() {
    const { k, p } = this.data;
    if (k === null || p === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const kVal = parseInt(k);
    const pVal = parseFloat(p);

    const coefficients = {
      1: 27, 2: 25, 3: 23, 4: 21, 5: 18, 6: 16, 7: 13, 8: 11, 9: 9, 10: 7
    };

   
    const coefficient = coefficients[kVal];
    const result = coefficient * pVal;

    // 生成详细计算过程
    const detailProcess = `计算公式：工伤赔偿金 = 伤残等级系数 × 上年度平均工资

输入数据：
• 伤残等级(K)：${kVal}级
• 上年度平均工资(P)：${pVal} 元

计算过程：
第一步：根据伤残等级确定系数
伤残等级系数表：
一级：27倍  二级：25倍  三级：23倍  四级：21倍  五级：18倍
六级：16倍  七级：13倍  八级：11倍  九级：9倍   十级：7倍

当前伤残等级：${kVal}级，对应系数：${coefficient}倍

第二步：计算工伤赔偿金
工伤赔偿金 = ${coefficient} × ${pVal}
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
    
    const { k, p } = this.data;
    const kVal = parseInt(k) || 0;
    const pVal = parseFloat(p) || 0;
    
    const coefficients = {
      1: 27, 2: 25, 3: 23, 4: 21, 5: 18, 6: 16, 7: 13, 8: 11, 9: 9, 10: 7
    };
    
    const coefficient = coefficients[kVal];
    
    const resultText = `【工伤赔偿计算】
    
计算公式：工伤赔偿金 = 伤残等级系数 × 上年度平均工资

输入数据：
• 伤残等级(K)：${kVal}级
• 上年度平均工资(P)：${pVal} 元

计算过程：
第一步：根据伤残等级确定系数
伤残等级系数表：
一级：27倍  二级：25倍  三级：23倍  四级：21倍  五级：18倍
六级：16倍  七级：13倍  八级：11倍  九级：9倍   十级：7倍

当前伤残等级：${kVal}级，对应系数：${coefficient}倍

第二步：计算工伤赔偿金
工伤赔偿金 = ${coefficient} × ${pVal}
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
    const shareTitle = result ? `我用工伤赔偿计算器算出了${result}元，快来试试吧！` : '工伤赔偿计算器，快来计算你的赔偿金！';
    
    return {
      title: shareTitle,
      path: '/injury-compensation/injury-compensation',
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
