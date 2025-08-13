Page({
  data: {
    // 输入数据
    salary: null,
    averageSalary: null,
    socialBase: null,
    
    // 手动设置的费率
    pensionRate: null,
    medicalRate: null,
    unemploymentRate: null,
    housingFundRate: null,
    
    // 控制选项
    autoCalculate: true,
    
    // 结果数据
    result: null,
    showDetail: false,
    detailProcess: ''
  },

  // 输入框事件处理
  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 滑动按钮切换事件处理
  toggleAutoCalculate: function() {
    const newValue = !this.data.autoCalculate;
    this.setData({
      autoCalculate: newValue
    });
    
    // 显示提示信息
    wx.showToast({
      title: newValue ? '已开启自动计算' : '已关闭自动计算',
      icon: 'none',
      duration: 1000
    });
  },

  // 展开/收起详细计算过程
  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  // 计算五险一金
  calculate: function() {
    // 获取所有输入数据
    const {
      salary,
      averageSalary,
      socialBase,
      pensionRate,
      medicalRate,
      unemploymentRate,
      housingFundRate,
      autoCalculate
    } = this.data;
    
    // 检查必填项
    if (salary === null || salary === '') {
      wx.showToast({
        title: '请填写工资总额',
        icon: 'none'
      });
      return;
    }
    
    // 将输入转换为数值
    const salaryVal = parseFloat(salary) || 0;
    const averageSalaryVal = parseFloat(averageSalary) || 0;
    const socialBaseVal = parseFloat(socialBase) || 0;
    
    // 费率设置（默认值或用户输入值）
    const pensionRateVal = parseFloat(pensionRate) || 8;      // 养老保险费率 8%
    const medicalRateVal = parseFloat(medicalRate) || 2;       // 医疗保险费率 2%
    const unemploymentRateVal = parseFloat(unemploymentRate) || 0.5; // 失业保险费率 0.5%
    const housingFundRateVal = parseFloat(housingFundRate) || 6;     // 住房公积金费率 6%
    
    let base = 0;
    let detailProcess = '';
    
    if (autoCalculate) {
      // 自动计算社保基数
      if (averageSalaryVal > 0) {
        // 使用工具函数计算社保基数
        const { calculateSocialBase } = require('../utils/calculator.js');
        base = calculateSocialBase(salaryVal, averageSalaryVal);
      } else {
        // 如果没有提供上年度平均工资，则使用工资总额作为基数
        base = salaryVal;
      }
      
      // 生成详细计算过程
      detailProcess = `五险一金计算过程：

输入数据：
• 工资总额：${salaryVal.toFixed(2)} 元
${averageSalaryVal > 0 ? `• 上年度社会平均工资：${averageSalaryVal.toFixed(2)} 元` : '• 未提供上年度社会平均工资'}

计算过程：
第一步：确定社保缴费基数
${averageSalaryVal > 0 ? 
  `根据规定，社保缴费基数为上年度社会平均工资的60%-300%之间：
  最低基数 = ${averageSalaryVal.toFixed(2)} × 60% = ${(averageSalaryVal * 0.6).toFixed(2)} 元
  最高基数 = ${averageSalaryVal.toFixed(2)} × 300% = ${(averageSalaryVal * 3).toFixed(2)} 元
  实际工资：${salaryVal.toFixed(2)} 元
  社保缴费基数 = max(${(averageSalaryVal * 0.6).toFixed(2)}, min(${salaryVal.toFixed(2)}, ${(averageSalaryVal * 3).toFixed(2)})) = ${base.toFixed(2)} 元` :
  `未提供上年度社会平均工资，社保缴费基数按工资总额计算：
  社保缴费基数 = ${base.toFixed(2)} 元`}
  
第二步：计算各项缴费金额（个人部分）
• 养老保险费率：${pensionRateVal}%，缴费金额 = ${base.toFixed(2)} × ${pensionRateVal}% = ${(base * pensionRateVal / 100).toFixed(2)} 元
• 医疗保险费率：${medicalRateVal}%，缴费金额 = ${base.toFixed(2)} × ${medicalRateVal}% = ${(base * medicalRateVal / 100).toFixed(2)} 元
• 失业保险费率：${unemploymentRateVal}%，缴费金额 = ${base.toFixed(2)} × ${unemploymentRateVal}% = ${(base * unemploymentRateVal / 100).toFixed(2)} 元
• 住房公积金费率：${housingFundRateVal}%，缴费金额 = ${base.toFixed(2)} × ${housingFundRateVal}% = ${(base * housingFundRateVal / 100).toFixed(2)} 元

第三步：计算个人缴费总额
个人缴费总额 = ${(base * pensionRateVal / 100).toFixed(2)} + ${(base * medicalRateVal / 100).toFixed(2)} + ${(base * unemploymentRateVal / 100).toFixed(2)} + ${(base * housingFundRateVal / 100).toFixed(2)} = ${((base * pensionRateVal / 100) + (base * medicalRateVal / 100) + (base * unemploymentRateVal / 100) + (base * housingFundRateVal / 100)).toFixed(2)} 元`;
    } else {
      // 手动计算模式
      base = socialBaseVal > 0 ? socialBaseVal : salaryVal;
      
      // 生成详细计算过程
      detailProcess = `五险一金计算过程：

输入数据：
• 工资总额：${salaryVal.toFixed(2)} 元
${socialBaseVal > 0 ? `• 社保缴费基数：${socialBaseVal.toFixed(2)} 元` : '• 未提供社保缴费基数'}

计算过程：
第一步：确定社保缴费基数
${socialBaseVal > 0 ? 
  `用户手动输入社保缴费基数：${socialBaseVal.toFixed(2)} 元` :
  `未提供社保缴费基数，按工资总额计算：${base.toFixed(2)} 元`}
  
第二步：计算各项缴费金额（个人部分）
• 养老保险费率：${pensionRateVal}%，缴费金额 = ${base.toFixed(2)} × ${pensionRateVal}% = ${(base * pensionRateVal / 100).toFixed(2)} 元
• 医疗保险费率：${medicalRateVal}%，缴费金额 = ${base.toFixed(2)} × ${medicalRateVal}% = ${(base * medicalRateVal / 100).toFixed(2)} 元
• 失业保险费率：${unemploymentRateVal}%，缴费金额 = ${base.toFixed(2)} × ${unemploymentRateVal}% = ${(base * unemploymentRateVal / 100).toFixed(2)} 元
• 住房公积金费率：${housingFundRateVal}%，缴费金额 = ${base.toFixed(2)} × ${housingFundRateVal}% = ${(base * housingFundRateVal / 100).toFixed(2)} 元

第三步：计算个人缴费总额
个人缴费总额 = ${(base * pensionRateVal / 100).toFixed(2)} + ${(base * medicalRateVal / 100).toFixed(2)} + ${(base * unemploymentRateVal / 100).toFixed(2)} + ${(base * housingFundRateVal / 100).toFixed(2)} = ${((base * pensionRateVal / 100) + (base * medicalRateVal / 100) + (base * unemploymentRateVal / 100) + (base * housingFundRateVal / 100)).toFixed(2)} 元`;
    }
    
    // 计算各项缴费金额
    const pension = base * pensionRateVal / 100;        // 养老保险
    const medical = base * medicalRateVal / 100;         // 医疗保险
    const unemployment = base * unemploymentRateVal / 100; // 失业保险
    const housingFund = base * housingFundRateVal / 100;   // 住房公积金
    
    // 个人缴费总额
    const total = pension + medical + unemployment + housingFund;
    
    // 结果对象
    const result = {
      pension: pension.toFixed(2),
      medical: medical.toFixed(2),
      unemployment: unemployment.toFixed(2),
      housingFund: housingFund.toFixed(2),
      total: total.toFixed(2)
    };
    
    this.setData({
      result: result,
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
    
    const resultText = `【五险一金计算结果】
    
${this.data.detailProcess}

计算结果：
• 养老保险：${this.data.result.pension} 元
• 医疗保险：${this.data.result.medical} 元
• 失业保险：${this.data.result.unemployment} 元
• 住房公积金：${this.data.result.housingFund} 元
• 个人缴费总额：${this.data.result.total} 元`;
    
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
    const shareTitle = result ? `我用五险一金计算器算出了${result.total}元，快来试试吧！` : '五险一金计算器，快来计算你的社保缴费！';
    
    return {
      title: shareTitle,
      path: '/social-insurance/social-insurance',
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
