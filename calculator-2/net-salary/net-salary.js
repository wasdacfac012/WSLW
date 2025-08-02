const { calculateSocialBase, calculateSocialSecurity, calculateIndividualIncomeTax } = require('../utils/calculator.js');

Page({
  data: {
    a: null,
    b: null,
    c: null,
    j: null,
    k: null,
    t: null,
    e: null,
    averageSalary: null,
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
    const { a, b, c, j, k, e, averageSalary, specialDeduction } = this.data;
    if (a === null || b === null || c === null || j === null || k === null || e === null || averageSalary === null) {
      wx.showToast({
        title: '请填写除加班费外的所有字段',
        icon: 'none'
      });
      return;
    }
    
    const aVal = parseFloat(a) || 0;
    const bVal = parseFloat(b) || 0;
    const cVal = parseFloat(c) || 0;
    const jVal = parseFloat(j) || 0;
    const kVal = parseFloat(k) || 0;
    const eVal = parseFloat(e) || 0;
    const averageSalaryVal = parseFloat(averageSalary) || 0;
    const specialDeductionVal = parseFloat(specialDeduction) || 0;

    // 计算应发工资（不含加班费）
    const absenceDeduction = (kVal * aVal) / 21.75;
    const grossWithoutOvertime = aVal + bVal + cVal - absenceDeduction;
    
    // 计算社保公积金基数
    const socialBase = calculateSocialBase(grossWithoutOvertime, averageSalaryVal);
    
    // 计算社保公积金个人缴费部分
    const socialSecurity = calculateSocialSecurity(grossWithoutOvertime, socialBase);
    
    // 计算个人所得税
    const incomeTax = calculateIndividualIncomeTax(grossWithoutOvertime, parseFloat(socialSecurity.total), specialDeductionVal);
    
    // 计算税后工资
    const result = grossWithoutOvertime + jVal - parseFloat(socialSecurity.total) - parseFloat(incomeTax.tax) - eVal;

    // 生成详细计算过程
    const detailProcess = `计算公式：税后工资 = 应发工资 + 加班费 - 社保公积金个人缴费 - 个人所得税 - 其他扣款
其中：缺勤扣款 = (缺勤天数 × 基本工资) ÷ 21.75

输入数据：
• 基本工资(A)：${aVal} 元
• 奖金(B)：${bVal} 元
• 津贴(C)：${cVal} 元
• 加班费(J)：${jVal} 元
• 缺勤天数(K)：${kVal} 天
• 其他扣款(E)：${eVal} 元
• 上年度平均工资：${averageSalaryVal} 元
• 专项扣除：${specialDeductionVal} 元

计算过程：
第一步：计算缺勤扣款
缺勤扣款 = (${kVal} × ${aVal}) ÷ 21.75
         = ${(kVal * aVal).toFixed(2)} ÷ 21.75
         = ${absenceDeduction.toFixed(2)} 元

第二步：计算应发工资（不含加班费）
应发工资 = ${aVal} + ${bVal} + ${cVal} - ${absenceDeduction.toFixed(2)}
         = ${(aVal + bVal + cVal).toFixed(2)} - ${absenceDeduction.toFixed(2)}
         = ${grossWithoutOvertime.toFixed(2)} 元

第三步：计算社保公积金缴费基数
根据规则：缴费基数 = max(最低基数, min(实际工资, 最高基数))
最低基数 = ${averageSalaryVal} × 60% = ${(0.6 * averageSalaryVal).toFixed(2)} 元
最高基数 = ${averageSalaryVal} × 300% = ${(3 * averageSalaryVal).toFixed(2)} 元
缴费基数 = max(${(0.6 * averageSalaryVal).toFixed(2)}, min(${grossWithoutOvertime.toFixed(2)}, ${(3 * averageSalaryVal).toFixed(2)}))
         = ${socialBase.toFixed(2)} 元

第四步：计算社保公积金个人缴费部分
养老保险(8%)：${socialBase.toFixed(2)} × 8% = ${socialSecurity.pension} 元
医疗保险(2%)：${socialBase.toFixed(2)} × 2% = ${socialSecurity.medical} 元
失业保险(0.5%)：${socialBase.toFixed(2)} × 0.5% = ${socialSecurity.unemployment} 元
住房公积金(6%)：${socialBase.toFixed(2)} × 6% = ${socialSecurity.housingFund} 元
社保公积金个人缴费合计：${socialSecurity.total} 元

第五步：计算个人所得税
应纳税所得额 = 应发工资 - 社保公积金个人缴费 - 专项扣除 - 起征点
             = ${grossWithoutOvertime.toFixed(2)} - ${socialSecurity.total} - ${specialDeductionVal} - 5000
             = ${incomeTax.taxableIncome} 元
根据税率表，适用税率：${incomeTax.taxRate}%，速算扣除数：${incomeTax.quickDeduction}
个人所得税 = ${incomeTax.taxableIncome} × ${incomeTax.taxRate}% - ${incomeTax.quickDeduction}
           = ${incomeTax.tax} 元

第六步：计算税后工资
税后工资 = ${grossWithoutOvertime.toFixed(2)} + ${jVal} - ${socialSecurity.total} - ${incomeTax.tax} - ${eVal}
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
    
    const resultText = `【税后工资计算】
    
${this.data.detailProcess}

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
    const shareTitle = result ? `我用税后工资计算器算出了${result}元，快来试试吧！` : '税后工资计算器，快来计算你的税后工资！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/net-salary/net-salary',
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
