// 2025年法定节假日数据
const LEGAL_HOLIDAYS_2025 = [
  '2025-01-01', // 元旦
  '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31', '2025-02-01', '2025-02-02', '2025-02-03', // 春节
  '2025-04-04', '2025-04-05', '2025-04-06', // 清明节
  '2025-05-01', '2025-05-02', '2025-05-03', '2025-05-04', '2025-05-05', // 劳动节
  '2025-05-31', '2025-06-01', '2025-06-02', // 端午节
  '2025-10-01', '2025-10-02', '2025-10-03', '2025-10-04', '2025-10-05', '2025-10-06', '2025-10-07', '2025-10-08' // 中秋节/国庆节
];

Page({
  data: {
    h1: null,
    h2: null,
    h3: null,
    monthlySalary: null,
    startDate: '',
    endDate: '',
    calculationMode: 'standard', // standard or comprehensive
    result: null,
    showDetail: false,
    detailProcess: '',
    showSalaryInfo: false
  },

  onLoad: function() {
    // 设置默认日期为今天
    const today = new Date();
    const formattedDate = this.formatDate(today);
    this.setData({
      startDate: formattedDate,
      endDate: formattedDate
    });
  },

  formatDate: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  bindDateChange: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  bindModeChange: function(e) {
    this.setData({
      calculationMode: e.detail.value
    });
  },

  toggleSalaryInfo: function() {
    this.setData({
      showSalaryInfo: !this.data.showSalaryInfo
    });
  },

  // 判断是否为法定节假日
  isLegalHoliday: function(dateStr) {
    return LEGAL_HOLIDAYS_2025.includes(dateStr);
  },

  // 判断是否为周末
  isWeekend: function(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // 0是周日，6是周六
  },

  // 获取日期的系数k和加班小时数hk
  getDateParameters: function(date, mode, h1, h2, h3) {
    const dateStr = this.formatDate(date);
    
    // 如果是法定节假日
    if (this.isLegalHoliday(dateStr)) {
      return {
        k: 3,
        hk: mode === 'standard' ? h3 : h2 // 标准工时用h3，综合工时用h2
      };
    }
    
    // 如果是周末
    if (this.isWeekend(date)) {
      if (mode === 'standard') {
        return {
          k: 2,
          hk: h2
        };
      } else {
        // 综合工时周末不计算加班
        return {
          k: 1.5,
          hk: 0
        };
      }
    }
    
    // 工作日
    return {
      k: 1.5,
      hk: h1
    };
  },

  calculate: function() {
    const { h1, h2, h3, monthlySalary, startDate, endDate, calculationMode } = this.data;
    
    if (h1 === null || h2 === null || h3 === null || monthlySalary === null || !startDate || !endDate) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const h1Val = parseFloat(h1) || 0;
    const h2Val = parseFloat(h2) || 0;
    const h3Val = parseFloat(h3) || 0;
    const monthlySalaryVal = parseFloat(monthlySalary) || 0;
    const dailySalary = monthlySalaryVal / (21.75 * 8); // 转换为日均工资
    
    // 解析日期
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      wx.showToast({
        title: '起始日期不能晚于结束日期',
        icon: 'none'
      });
      return;
    }
    
    // 计算每天的加班费
    let totalOvertime = 0;
    let detailProcess = `计算公式：An = An-1 + k*p*hk\n其中k为加班费系数，p为日均工资，hk为平均每时段加班小时数\n\n`;
    detailProcess += `计算模式：${calculationMode === 'standard' ? '标准工时' : '综合工时'}\n\n`;
    detailProcess += `输入数据：\n`;
    detailProcess += `• 平时时段平均加班小时数(H1)：${h1Val} 小时\n`;
    detailProcess += `• 周末时段平均加班小时数(H2)：${h2Val} 小时\n`;
    detailProcess += `• 法定节假日平均加班小时数(H3)：${h3Val} 小时\n`;
    detailProcess += `• 月工资：${monthlySalaryVal} 元\n`;
    detailProcess += `• 日均工资(P)：${dailySalary.toFixed(2)} 元 (月工资/(21.75*8))\n`;
    detailProcess += `• 加班起始日期：${startDate}\n`;
    detailProcess += `• 加班结束日期：${endDate}\n\n`;
    
    // 简略计算过程
    detailProcess += `简略计算过程：\n`;
    detailProcess += `1. 确定计算参数：H1、H2、H3、月工资、加班日期范围\n`;
    detailProcess += `2. 计算日均工资：P = 月工资 / (21.75 × 8)\n`;
    detailProcess += `3. 按日期类型确定系数和加班小时数\n`;
    detailProcess += `   - 法定节假日：k=3, hk=H3(标准工时)或H2(综合工时)\n`;
    detailProcess += `   - 周末：标准工时k=2,hk=H2；综合工时k=1.5,hk=0\n`;
    detailProcess += `   - 工作日：k=1.5, hk=H1\n`;
    detailProcess += `4. 逐日计算加班费：每日加班费 = k × P × hk\n`;
    detailProcess += `5. 累计总加班费：总加班费 = Σ(每日加班费)\n\n`;
    
    detailProcess += `详细计算过程：\n`;
    
    let currentDate = new Date(start);
    let dayIndex = 1;
    let previousTotal = 0;
    
    while (currentDate <= end) {
      const dateStr = this.formatDate(currentDate);
      const params = this.getDateParameters(currentDate, calculationMode, h1Val, h2Val, h3Val);
      const dailyOvertime = params.k * dailySalary * params.hk;
      const currentTotal = previousTotal + dailyOvertime;
      
      detailProcess += `第${dayIndex}天 (${dateStr})：\n`;
      detailProcess += `  系数k = ${params.k}\n`;
      detailProcess += `  加班小时数hk = ${params.hk}\n`;
      detailProcess += `  当日加班费 = ${params.k} × ${dailySalary.toFixed(2)} × ${params.hk} = ${dailyOvertime.toFixed(2)} 元\n`;
      detailProcess += `  累计加班费 = ${previousTotal.toFixed(2)} + ${dailyOvertime.toFixed(2)} = ${currentTotal.toFixed(2)} 元\n\n`;
      
      totalOvertime = currentTotal;
      previousTotal = currentTotal;
      currentDate.setDate(currentDate.getDate() + 1);
      dayIndex++;
    }
    
    detailProcess += `最终结果：${totalOvertime.toFixed(2)} 元`;
    
    this.setData({
      result: totalOvertime.toFixed(2),
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
    
    const { h1, h2, h3, monthlySalary, startDate, endDate, calculationMode, result } = this.data;
    const h1Val = parseFloat(h1) || 0;
    const h2Val = parseFloat(h2) || 0;
    const h3Val = parseFloat(h3) || 0;
    const monthlySalaryVal = parseFloat(monthlySalary) || 0;
    const dailySalary = monthlySalaryVal / (21.75 * 8);
    
    const resultText = `【合并工时加班费计算】
    
${this.data.detailProcess}`;
    
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
    const shareTitle = result ? `我用合并工时加班费计算器算出了${result}元，快来试试吧！` : '合并工时加班费计算器，快来计算你的加班费！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/merged-overtime/merged-overtime',
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
