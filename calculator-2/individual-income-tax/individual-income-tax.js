Page({
  data: {
    salary: null,
    socialSecurity: null,
    specialDeduction: null,
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
    const { salary, socialSecurity, specialDeduction } = this.data;
    if (salary === null) {
      wx.showToast({
        title: '请填写工资收入',
        icon: 'none'
      });
      return;
    }
    
    const salaryVal = parseFloat(salary) || 0;
    const socialSecurityVal = parseFloat(socialSecurity) || 0;
    const specialDeductionVal = parseFloat(specialDeduction) || 0;

    // 计算应纳税所得额
    const taxableIncome = salaryVal - socialSecurityVal - specialDeductionVal - 5000;

    // 根据税率表计算个税
    let tax = 0;
    let taxRate = 0;
    let quickDeduction = 0;
    
    if (taxableIncome <= 0) {
      tax = 0;
    } else if (taxableIncome <= 5000) {
      taxRate = 0.05;
      quickDeduction = 0;
      tax = taxableIncome * taxRate - quickDeduction;
    } else if (taxableIncome <= 10000) {
      taxRate = 0.1;
      quickDeduction = 250;
      tax = taxableIncome * taxRate - quickDeduction;
    } else if (taxableIncome <= 30000) {
      taxRate = 0.2;
      quickDeduction = 1250;
      tax = taxableIncome * taxRate - quickDeduction;
    } else if (taxableIncome <= 50000) {
      taxRate = 0.3;
      quickDeduction = 4250;
      tax = taxableIncome * taxRate - quickDeduction;
    } else {
      taxRate = 0.35;
      quickDeduction = 6750;
      tax = taxableIncome * taxRate - quickDeduction;
    }

    // 确保税额不为负数
    tax = Math.max(0, tax);

    // 生成详细计算过程
    const detailProcess = `个人所得税计算过程：

输入数据：
• 工资收入：${salaryVal.toFixed(2)} 元
• 五险一金个人缴费：${socialSecurityVal.toFixed(2)} 元
• 专项扣除：${specialDeductionVal.toFixed(2)} 元

计算过程：
第一步：计算应纳税所得额
应纳税所得额 = 工资收入 - 五险一金个人缴费 - 专项扣除 - 起征点
             = ${salaryVal.toFixed(2)} - ${socialSecurityVal.toFixed(2)} - ${specialDeductionVal.toFixed(2)} - 5000
             = ${taxableIncome.toFixed(2)} 元

第二步：确定适用税率和速算扣除数
根据应纳税所得额 ${taxableIncome.toFixed(2)} 元，查找税率表：
适用税率：${(taxRate * 100).toFixed(0)}%
速算扣除数：${quickDeduction.toFixed(0)} 元

第三步：计算应纳税额
应纳税额 = 应纳税所得额 × 税率 - 速算扣除数
         = ${taxableIncome.toFixed(2)} × ${(taxRate * 100).toFixed(0)}% - ${quickDeduction.toFixed(0)}
         = ${tax.toFixed(2)} 元

最终结果：应缴纳个人所得税 ${tax.toFixed(2)} 元`;

    this.setData({
      result: tax.toFixed(2),
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
    
    const resultText = `【个人所得税计算结果】
    
${this.data.detailProcess}

最终结果：应缴纳个人所得税 ${this.data.result} 元`;
    
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
    const shareTitle = result ? `我用个人所得税计算器算出了${result}元，快来试试吧！` : '个人所得税计算器，快来计算你需要缴纳的个税！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/individual-income-tax/individual-income-tax',
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
