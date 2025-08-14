Page({
  data: {
    startDate: '', // 实际用工开始时间
    arbitrationDate: '', // 申请仲裁时间
    salary: null, // 应发工资
    result: null, // 计算结果
    showDetail: false, // 是否显示详细计算过程
    detailProcess: '' // 详细计算过程
  },

  // 处理开始日期输入
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    });
  },

  // 处理仲裁日期输入
  bindArbitrationDateChange: function(e) {
    this.setData({
      arbitrationDate: e.detail.value
    });
  },

  // 处理工资输入
  bindSalaryInput: function(e) {
    this.setData({
      salary: e.detail.value
    });
  },

  // 计算双倍工资
  calculate: function() {
    const { startDate, arbitrationDate, salary } = this.data;
    
    // 验证输入
    if (!startDate || !arbitrationDate) {
      wx.showToast({
        title: '请选择开始时间和仲裁时间',
        icon: 'none'
      });
      return;
    }
    
    if (!salary) {
      wx.showToast({
        title: '请输入应发工资',
        icon: 'none'
      });
      return;
    }
    
    const salaryVal = parseFloat(salary);
    if (isNaN(salaryVal) || salaryVal <= 0) {
      wx.showToast({
        title: '请输入有效的工资数额',
        icon: 'none'
      });
      return;
    }
    
    // 解析日期
    const startDateObj = new Date(startDate);
    const arbitrationDateObj = new Date(arbitrationDate);
    
    // 验证日期逻辑
    if (startDateObj >= arbitrationDateObj) {
      wx.showToast({
        title: '开始时间应早于仲裁时间',
        icon: 'none'
      });
      return;
    }
    
    // 计算工作月数
    const workMonths = this.calculateWorkMonths(startDateObj, arbitrationDateObj);
    
    // 计算日工资
    const dailySalary = salaryVal / 21.75;
    
    // 根据新公式计算双倍工资
    let doubleSalary = 0;
    let calculationDetail = '';
    
    if (workMonths <= 1) {
      // B-A <= 1个月，第二倍工资=0
      doubleSalary = 0;
      calculationDetail = `用工时间不超过1个月
第二倍工资 = 0 元`;
    } else if (workMonths > 1 && workMonths <= 12) {
      // 1 < B-A <= 12个月，第二倍工资=P*(B-A)
      // 计算工作天数
      const workDays = this.calculateWorkDays(startDateObj, arbitrationDateObj);
      doubleSalary = dailySalary * workDays;
      calculationDetail = `用工时间大于1个月且不超过12个月
第二倍工资 = 日工资 × 工作天数
第二倍工资 = ${dailySalary.toFixed(2)} × ${workDays}天
第二倍工资 = ${doubleSalary.toFixed(2)} 元`;
    } else if (workMonths === 13) {
      // B-A = 13个月，第二倍工资=P*11个月
      doubleSalary = salaryVal * 11;
      calculationDetail = `用工时间为13个月
第二倍工资 = 月工资 × 11个月
第二倍工资 = ${salaryVal.toFixed(2)} × 11
第二倍工资 = ${doubleSalary.toFixed(2)} 元`;
    } else if (workMonths > 13 && workMonths <= 23) {
      // 13个月 < B-A <= 24个月，第二倍工资=P*(24个月-(B-A))
      const months = 23 - workMonths;
      doubleSalary = salaryVal * months;
      calculationDetail = `用工时间大于13个月且不超过24个月
第二倍工资 = 月工资 × (23个月 - 实际用工月数)
第二倍工资 = ${salaryVal.toFixed(2)} × (23 - ${workMonths})
第二倍工资 = ${salaryVal.toFixed(2)} × ${months}
第二倍工资 = ${doubleSalary.toFixed(2)} 元`;
    } else {
      // B-A > 24个月，第二倍工资=0
      doubleSalary = 0;
      calculationDetail = `用工时间超过23个月
第二倍工资 = 0 元`;
    }
    
    // 生成详细计算过程
    const detailProcess = `
输入数据：
• 实际用工开始时间：${startDate}
• 申请仲裁时间：${arbitrationDate}
• 应发工资：${salaryVal.toFixed(2)} 元/月

计算过程：
第一步：计算时间差
• 开始用工至仲裁时间差：${workMonths}个月

第二步：计算日工资
日工资 = 月工资 ÷ 21.75
日工资 = ${salaryVal.toFixed(2)} ÷ 21.75
日工资 = ${dailySalary.toFixed(2)} 元/天

第三步：根据公式计算双倍工资
${calculationDetail}

最终结果：${doubleSalary.toFixed(2)} 元`;

    this.setData({
      result: doubleSalary.toFixed(2),
      detailProcess: detailProcess,
      showDetail: false
    });
  },

  // 计算工作月数
  calculateWorkMonths: function(startDate, endDate) {
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    
    // 如果结束日期的天数大于开始日期的天数，则月份加1
    if (endDate.getDate() >= startDate.getDate()) {
      months++;
    }
    
    return months > 0 ? months : 0;
  },

  // 计算工作天数
  calculateWorkDays: function(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000; // 小时*分钟*秒*毫秒
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    return diffDays;
  },

  // 切换详细信息显示
  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
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
    
    const resultText = `【双倍工资计算器】
    
${this.data.detailProcess}

最终结果：${this.data.result} 元`;
    
    wx.setClipboardData({
      data: resultText,
      success: function() {
        wx.showToast({
          title: '计算结果已复制',
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
    const shareTitle = result ? `我用双倍工资计算器算出了${result}元，快来试试吧！` : '双倍工资计算器，快来计算你的双倍工资！';
    
    return {
      title: shareTitle,
      path: '/double-salary/double-salary',
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
