// 引入工具函数
const { calculateSocialBase, calculateSocialSecurity, calculateIndividualIncomeTax } = require('../utils/calculator.js');

Page({
  data: {
    salary: null,
    socialSecurity: null,
    specialDeduction: null,
    averageSalary: null,
    autoCalculate: false,
    result: null,
    showDetail: false,
    detailProcess: '',
  },

  // 滑动条组件事件处理
  bindSliderChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value === 1 ? true : false;
    
    // 添加过渡效果
    this.setData({
      [field]: value
    });
    
    // 可以在这里添加其他交互效果
    if (field === 'autoCalculate') {
      wx.showToast({
        title: value ? '已开启自动计算' : '已关闭自动计算',
        icon: 'none',
        duration: 1000
      });
    }
  },

  // 按钮切换事件处理
  toggleAutoCalculate: function(e) {
    const field = e.currentTarget.dataset.field;
    const currentValue = this.data[field];
    const newValue = !currentValue;
    
    // 更新数据
    this.setData({
      [field]: newValue
    });
    
    // 显示提示信息
    if (field === 'autoCalculate') {
      wx.showToast({
        title: newValue ? '已开启自动计算' : '已关闭自动计算',
        icon: 'none',
        duration: 1000
      });
    }
  },

  // 处理输入框变化
  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [field]: value
    });
  },


  calculate: function() {
    const { salary, socialSecurity, specialDeduction, autoCalculate, averageSalary } = this.data;
    
    if (salary === null || salary === '') {
      wx.showToast({
        title: '请填写工资收入',
        icon: 'none'
      });
      return;
    }
    
    const salaryVal = parseFloat(salary) || 0;
    let socialSecurityVal = 0;
    const specialDeductionVal = parseFloat(specialDeduction) || 0;
    let calculationDetail = '';
    
    if (autoCalculate) {
      // 自动计算五险一金
      if (averageSalary === null || averageSalary === '') {
        wx.showToast({
          title: '请填写上年度平均工资',
          icon: 'none'
        });
        return;
      }
      
      const averageSalaryVal = parseFloat(averageSalary) || 0;
      
      // 计算社保基数
      const socialBase = calculateSocialBase(salaryVal, averageSalaryVal);
      
      // 计算五险一金个人缴费
      const socialSecurityDetail = calculateSocialSecurity(salaryVal, socialBase);
      socialSecurityVal = parseFloat(socialSecurityDetail.total);
      
      calculationDetail = `自动计算五险一金：
• 上年度平均工资：${averageSalaryVal.toFixed(2)} 元
• 社保缴费基数：${socialBase.toFixed(2)} 元
• 养老保险：${socialSecurityDetail.pension} 元
• 医疗保险：${socialSecurityDetail.medical} 元
• 失业保险：${socialSecurityDetail.unemployment} 元
• 住房公积金：${socialSecurityDetail.housingFund} 元
• 五险一金个人缴费总额：${socialSecurityVal.toFixed(2)} 元

`;
    } else {
      // 手动输入五险一金
      socialSecurityVal = parseFloat(socialSecurity) || 0;
    }
    
    // 计算个人所得税
    const taxResult = calculateIndividualIncomeTax(salaryVal, socialSecurityVal, specialDeductionVal);
    
    // 生成详细计算过程
    const detailProcess = `个人所得税计算过程：

输入数据：
• 工资收入：${salaryVal.toFixed(2)} 元
${autoCalculate ? '• 自动计算五险一金' : '• 五险一金个人缴费：' + socialSecurityVal.toFixed(2) + ' 元'}
• 专项扣除：${specialDeductionVal.toFixed(2)} 元

${calculationDetail}计算过程：
第一步：计算应纳税所得额
应纳税所得额 = 工资收入 - 五险一金个人缴费 - 专项扣除 - 起征点
             = ${salaryVal.toFixed(2)} - ${socialSecurityVal.toFixed(2)} - ${specialDeductionVal.toFixed(2)} - 5000
             = ${taxResult.taxableIncome} 元

第二步：确定适用税率和速算扣除数
根据应纳税所得额 ${taxResult.taxableIncome} 元，查找税率表：
适用税率：${taxResult.taxRate}%
速算扣除数：${taxResult.quickDeduction} 元

第三步：计算应纳税额
应纳税额 = 应纳税所得额 × 税率 - 速算扣除数
         = ${taxResult.taxableIncome} × ${taxResult.taxRate}% - ${taxResult.quickDeduction}
         = ${taxResult.tax} 元

最终结果：应缴纳个人所得税 ${taxResult.tax} 元`;

    this.setData({
      result: taxResult.tax,
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
      path: '/individual-income-tax/individual-income-tax',
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
