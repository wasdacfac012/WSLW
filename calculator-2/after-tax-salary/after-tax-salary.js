Page({
  data: {
    // 时间周期项目
    lastPayDate: '',
    currentPayDate: '',
    absentDays: null,
    workDays: null,
    averageSalary: null,
    
    // 必选项
    baseSalary: null,
    performanceSalary: null,
    commission: null,
    legalAllowance: null,
    subsidy: null,
    bonus: null,
    specialDeduction: null,
    
    // 可选项
    overtimePay: null,
    individualTax: null,
    socialInsurance: null,
    otherDeduction: null,
    
    // 选择项
    isFullAttendance: true,
    autoCalculateTax: true,
    autoCalculateInsurance: true,
    
    // 结果相关
    result: null,
    showDetail: false,
    showExplanation: false,
    detailProcess: ''
  },

  // 输入框事件处理
  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 日期选择器事件处理
  bindDateChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    // 如果是上次发工资日期发生变化，自动计算本次发工资日期
    if (field === 'lastPayDate') {
      const currentDate = this.calculateNextMonthDate(value);
      this.setData({
        [field]: value,
        currentPayDate: currentDate
      });
    } else {
      this.setData({
        [field]: value
      });
    }
  },

  // 计算下个月的日期
  calculateNextMonthDate: function(dateString) {
    if (!dateString) return '';
    
    // 解析日期字符串
    const date = new Date(dateString);
    
    // 获取年、月、日
    let year = date.getFullYear();
    let month = date.getMonth(); // 0-11
    let day = date.getDate();
    
    // 月份加1
    month += 1;
    
    // 处理月份溢出情况
    if (month > 11) {
      month = 0;
      year += 1;
    }
    
    // 创建下个月的日期
    const nextMonthDate = new Date(year, month, day);
    
    // 检查日期是否有效（处理2月30日等无效日期）
    if (nextMonthDate.getMonth() !== month) {
      // 如果日期无效，设置为该月的最后一天
      nextMonthDate.setDate(0); // 设置为上个月的最后一天，即当前月的最后一天
    }
    
    // 格式化为 YYYY-MM-DD 格式
    const formattedYear = nextMonthDate.getFullYear();
    const formattedMonth = String(nextMonthDate.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(nextMonthDate.getDate()).padStart(2, '0');
    
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  },

  // 开关组件事件处理
  bindSwitchChange: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
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
    if (field === 'autoCalculateInsurance') {
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
    if (field === 'autoCalculateInsurance') {
      wx.showToast({
        title: newValue ? '已开启自动计算' : '已关闭自动计算',
        icon: 'none',
        duration: 1000
      });
    }
  },

  // 展开/收起详细计算过程
  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  // 计算税后工资
  calculate: function() {
    // 获取所有输入数据
    const {
      lastPayDate,
      currentPayDate,
      absentDays,
      workDays,
      averageSalary,
      baseSalary,
      performanceSalary,
      commission,
      legalAllowance,
      subsidy,
      bonus,
      specialDeduction,
      overtimePay,
      individualTax,
      socialInsurance,
      otherDeduction,
      isFullAttendance,
      autoCalculateTax,
      autoCalculateInsurance
    } = this.data;
    
    // 检查必填项
    if (!lastPayDate || !currentPayDate) {
      wx.showToast({
        title: '请选择时间周期',
        icon: 'none'
      });
      return;
    }
    
    if (baseSalary === null || baseSalary === '') {
      wx.showToast({
        title: '请填写底薪',
        icon: 'none'
      });
      return;
    }
    
    // 将输入转换为数值
    const baseSalaryVal = parseFloat(baseSalary) || 0;
    const performanceSalaryVal = parseFloat(performanceSalary) || 0;
    const commissionVal = parseFloat(commission) || 0;
    const legalAllowanceVal = parseFloat(legalAllowance) || 0;
    const subsidyVal = parseFloat(subsidy) || 0;
    const bonusVal = parseFloat(bonus) || 0;
    const specialDeductionVal = parseFloat(specialDeduction) || 0;
    const overtimePayVal = parseFloat(overtimePay) || 0;
    const otherDeductionVal = parseFloat(otherDeduction) || 0;
    const absentDaysVal = parseFloat(absentDays) || 0;
    const workDaysVal = parseFloat(workDays) || 0;
    const averageSalaryVal = parseFloat(averageSalary) || 0;
    
    // 计算固定工资W1
    let W1 = 0;
    if (isFullAttendance) {
      // 全勤情况
      W1 = baseSalaryVal;
    } else if (absentDaysVal <= 21) {
      // 缺勤天数小于等于21天
      W1 = baseSalaryVal * (1 - absentDaysVal / 21.75);
    } else {
      // 缺勤天数大于21天
      W1 = baseSalaryVal * workDaysVal;
    }
    
    // 计算可变工资W2
    const W2 = performanceSalaryVal + commissionVal + legalAllowanceVal + 
               subsidyVal + bonusVal + overtimePayVal - specialDeductionVal;
    
    // 计算个税保险费W3
    let W3 = 0;
    let individualTaxVal = 0;
    let socialInsuranceVal = 0;
    
    if (autoCalculateTax) {
      // 自动计算个税
      const totalIncome = W1 + W2;
      const taxResult = calculateIndividualIncomeTax(totalIncome, socialInsuranceVal, specialDeductionVal);
      individualTaxVal = parseFloat(taxResult.tax) || 0;
    } else {
      // 手动输入个税
      individualTaxVal = parseFloat(individualTax) || 0;
    }
    
    if (autoCalculateInsurance) {
      // 自动计算五险一金
      const totalIncome = W1 + W2;
      // 计算社保基数（需要用户提供上年度平均工资）
      // 如果用户输入了上年度平均工资，则使用该值计算社保基数
      // 否则使用总收入作为基数
      let socialBase = totalIncome;
      if (averageSalaryVal > 0) {
        // 使用工具函数计算社保基数
        const { calculateSocialBase } = require('../utils/calculator.js');
        socialBase = calculateSocialBase(totalIncome, averageSalaryVal);
      }
      const insuranceResult = calculateSocialSecurity(totalIncome, socialBase);
      socialInsuranceVal = parseFloat(insuranceResult.total) || 0;
    } else {
      // 手动输入五险一金
      socialInsuranceVal = parseFloat(socialInsurance) || 0;
    }
    
    W3 = individualTaxVal + socialInsuranceVal;
    
    // 计算税后工资总额W
    const W = W1 + W2 - W3 - otherDeductionVal;
    
    // 生成详细计算过程
    const detailProcess = `税后工资计算过程：

输入数据：
时间周期项目：
• 上次发工资日期：${lastPayDate}
• 本次发工资日期：${currentPayDate}
• 缺勤天数：${absentDaysVal} 天
• 出勤天数：${workDaysVal} 天

必填项目：
• 底薪：${baseSalaryVal.toFixed(2)} 元
• 绩效工资：${performanceSalaryVal.toFixed(2)} 元
• 提成：${commissionVal.toFixed(2)} 元
• 法定津贴：${legalAllowanceVal.toFixed(2)} 元
• 补贴：${subsidyVal.toFixed(2)} 元
• 奖金：${bonusVal.toFixed(2)} 元
• 专项扣除：${specialDeductionVal.toFixed(2)} 元

可选项目：
• 加班费：${overtimePayVal.toFixed(2)} 元
• 其它增加扣除费用：${otherDeductionVal.toFixed(2)} 元

选择项：
• 是否全勤：${isFullAttendance ? '是' : '否'}
• 是否自动计算个税：${autoCalculateTax ? '是' : '否'}
• 是否自动计算五险一金：${autoCalculateInsurance ? '是' : '否'}

计算过程：
第一步：计算固定工资W1
${isFullAttendance ? 
  `员工全勤，固定工资W1 = 底薪 = ${baseSalaryVal.toFixed(2)} 元` :
  (absentDaysVal <= 21 ? 
    `缺勤天数(${absentDaysVal}天) ≤ 21天，固定工资W1 = 底薪 × (1 - 缺勤时间/21.75) = ${baseSalaryVal.toFixed(2)} × (1 - ${absentDaysVal}/21.75) = ${W1.toFixed(2)} 元` :
    `缺勤天数(${absentDaysVal}天) > 21天，固定工资W1 = 底薪 × 出勤天数 = ${baseSalaryVal.toFixed(2)} × ${workDaysVal} = ${W1.toFixed(2)} 元`)
}

第二步：计算可变工资W2
可变工资W2 = 绩效工资 + 提成 + 法定津贴 + 补贴 + 奖金 + 加班费 - 专项扣除
           = ${performanceSalaryVal.toFixed(2)} + ${commissionVal.toFixed(2)} + ${legalAllowanceVal.toFixed(2)} + ${subsidyVal.toFixed(2)} + ${bonusVal.toFixed(2)} + ${overtimePayVal.toFixed(2)} - ${specialDeductionVal.toFixed(2)}
           = ${W2.toFixed(2)} 元

第三步：计算个税保险费W3
${autoCalculateTax ? 
  `自动计算个税：
  总收入 = 固定工资 + 可变工资 = ${W1.toFixed(2)} + ${W2.toFixed(2)} = ${(W1 + W2).toFixed(2)} 元
  个税 = ${individualTaxVal.toFixed(2)} 元` : 
  `手动输入个税：${individualTaxVal.toFixed(2)} 元`}

${autoCalculateInsurance ? 
  `自动计算五险一金：
  ${averageSalaryVal > 0 ? `社保基数 = ${socialBase.toFixed(2)} 元\n  ` : ''}五险一金 = ${socialInsuranceVal.toFixed(2)} 元` : 
  `手动输入五险一金：${socialInsuranceVal.toFixed(2)} 元`}

个税保险费W3 = 个税 + 五险一金 = ${individualTaxVal.toFixed(2)} + ${socialInsuranceVal.toFixed(2)} = ${W3.toFixed(2)} 元

第四步：计算税后工资总额W
税后工资总额W = 固定工资W1 + 可变工资W2 - 个税保险费W3 - 其它增加扣除费用
              = ${W1.toFixed(2)} + ${W2.toFixed(2)} - ${W3.toFixed(2)} - ${otherDeductionVal.toFixed(2)}
              = ${W.toFixed(2)} 元

最终结果：税后工资 ${W.toFixed(2)} 元`;
    
    this.setData({
      result: W.toFixed(2),
      detailProcess: detailProcess,
      showDetail: false
    });
  },

  // 复制结果
  copyResult: function() {
    if (this.data.result === null) {
      wx.showToast({
        title: '没有计算结果可复制',
        icon: 'none'
      });
      return;
    }
    
    const resultText = `【税后工资计算结果】
    
${this.data.detailProcess}

最终结果：税后工资 ${this.data.result} 元`;
    
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
    const shareTitle = result ? `我用税后工资计算器算出了${result}元，快来试试吧！` : '税后工资计算器，快来计算你的实际收入！';
    
    return {
      title: shareTitle,
      path: '/after-tax-salary/after-tax-salary',
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

  // 显示解释文本
  showExplanation: function(e) {
    const field = e.currentTarget.dataset.field;
    const explanation = afterTaxSalaryExplanations[field];
    
    if (explanation) {
      wx.showModal({
        title: '说明',
        content: explanation,
        showCancel: false,
        confirmText: '确定'
      });
    }
  }
})
