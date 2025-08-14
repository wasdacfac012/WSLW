

Page({
  data: {
    k: null,
    p: null,
    result: null,
    disabilityAllowance: null,  // 伤残津贴
    selectedAllowanceLevel: null, // 选中的伤残津贴等级
    showDetail: false,
    detailProcess: '',
    disabilityData: [
      { level: '一级', coefficient: 27, checked: false },
      { level: '二级', coefficient: 25, checked: false },
      { level: '三级', coefficient: 23, checked: false },
      { level: '四级', coefficient: 21, checked: false },
      { level: '五级', coefficient: 18, checked: false },
      { level: '六级', coefficient: 16, checked: false },
      { level: '七级', coefficient: 13, checked: false },
      { level: '八级', coefficient: 11, checked: false },
      { level: '九级', coefficient: 9, checked: false },
      { level: '十级', coefficient: 7, checked: false }
    ],
    // 伤残津贴比例表（1-6级）
    disabilityAllowanceRates: {
      1: 0.90,  // 一级伤残：本人工资×90％
      2: 0.85,  // 二级伤残：本人工资×85％
      3: 0.80,  // 三级伤残：本人工资×80％
      4: 0.75,  // 四级伤残：本人工资×75％
      5: 0.70,  // 五级伤残：本人工资×70％
      6: 0.60   // 六级伤残：本人工资×60％
    },

  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  bindDisabilityChange: function(e) {
    // 重置所有选项为未选中状态
    const updatedDisabilityData = this.data.disabilityData.map(item => {
      return { ...item, checked: false };
    });
    
    // 设置选中的选项
    const selectedLevel = e.detail.value;
    const selectedIndex = this.data.disabilityData.findIndex(item => item.level === selectedLevel);
    
    if (selectedIndex !== -1) {
      updatedDisabilityData[selectedIndex].checked = true;
      
      this.setData({
        k: selectedIndex + 1, // 伤残等级从1级到10级
        disabilityData: updatedDisabilityData
      });
    }
  },

  // 处理伤残津贴等级选择
  bindAllowanceLevelChange: function(e) {
    const selectedLevel = parseInt(e.detail.value);
    this.setData({
      selectedAllowanceLevel: selectedLevel
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

    // 计算伤残津贴（仅适用于1-6级伤残）
    let disabilityAllowance = null;
    if (kVal >= 1 && kVal <= 6) {
      const allowanceRate = this.data.disabilityAllowanceRates[kVal];
      disabilityAllowance = pVal * allowanceRate;
    }

    // 生成详细计算过程
    let detailProcess = `计算公式：工伤赔偿金 = 伤残等级系数 × 本人平均月缴费工资

输入数据：
• 伤残等级(K)：${kVal}级
• 本人平均月缴费工资(P)：${pVal} 元

计算过程：
第一步：根据伤残等级确定系数
伤残等级系数表：
一级：27倍平均月缴费工资  二级：25倍平均月缴费工资  三级：23倍平均月缴费工资  四级：21倍平均月缴费工资  五级：18倍平均月缴费工资
六级：16倍平均月缴费工资  七级：13倍平均月缴费工资  八级：11倍平均月缴费工资  九级：9倍平均月缴费工资   十级：7倍平均月缴费工资

当前伤残等级：${kVal}级，对应系数：${coefficient}倍

第二步：计算工伤赔偿金
工伤赔偿金 = ${coefficient} × ${pVal}
           = ${result.toFixed(2)} 元`;

    // 如果是1-6级伤残，添加伤残津贴计算过程
    if (kVal >= 1 && kVal <= 6) {
      const allowanceRate = this.data.disabilityAllowanceRates[kVal];
      detailProcess += `

【伤残津贴计算】
依据《工伤保险条例》第三十五条、第三十六条规定，职工因工致残被鉴定为一级至六级伤残的，按月支付伤残津贴，标准如下：

计算公式：伤残津贴 = 本人工资 × 津贴比例

输入数据：
• 伤残等级：${kVal}级
• 本人工资：${pVal} 元
• 津贴比例：${(allowanceRate * 100).toFixed(0)}%

计算过程：
伤残津贴 = ${pVal} × ${allowanceRate}
         = ${disabilityAllowance.toFixed(2)} 元/月`;
    }

    this.setData({
      result: result.toFixed(2),
      disabilityAllowance: disabilityAllowance,
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
    
    const { k, p, disabilityAllowance } = this.data;
    const kVal = parseInt(k) || 0;
    const pVal = parseFloat(p) || 0;
    
    const coefficients = {
      1: 27, 2: 25, 3: 23, 4: 21, 5: 18, 6: 16, 7: 13, 8: 11, 9: 9, 10: 7
    };
    
    const coefficient = coefficients[kVal];
    
    let resultText = `【工伤赔偿计算】
    
计算公式：工伤赔偿金 = 伤残等级系数 × 本人平均月缴费工资

输入数据：
• 伤残等级(K)：${kVal}级
• 本人平均月缴费工资(P)：${pVal} 元

计算过程：
第一步：根据伤残等级确定系数
伤残等级系数表：
一级：27倍平均月缴费工资  二级：25倍平均月缴费工资  三级：23倍平均月缴费工资  四级：21倍平均月缴费工资  五级：18倍平均月缴费工资
六级：16倍平均月缴费工资  七级：13倍平均月缴费工资  八级：11倍平均月缴费工资  九级：9倍平均月缴费工资   十级：7倍平均月缴费工资

当前伤残等级：${kVal}级，对应系数：${coefficient}倍

第二步：计算工伤赔偿金
工伤赔偿金 = ${coefficient} × ${pVal}
           = ${this.data.result} 元

最终结果：${this.data.result} 元`;
    
    // 如果是1-6级伤残，添加伤残津贴信息
    if (kVal >= 1 && kVal <= 6) {
      const allowanceRate = this.data.disabilityAllowanceRates[kVal];
      resultText += `

【伤残津贴】
依据《工伤保险条例》第三十五条、第三十六条规定，职工因工致残被鉴定为一级至六级伤残的，按月支付伤残津贴，标准如下：

计算公式：伤残津贴 = 本人工资 × 津贴比例

输入数据：
• 伤残等级：${kVal}级
• 本人工资：${pVal} 元
• 津贴比例：${(allowanceRate * 100).toFixed(0)}%

计算过程：
伤残津贴 = ${pVal} × ${allowanceRate}
         = ${disabilityAllowance.toFixed(2)} 元/月

最终结果：${disabilityAllowance.toFixed(2)} 元/月`;
    }
    
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
