Page({
  data: {
    n: null, // 用工月数
    p: null, // 前十二个月的平均工资
    minWage: null, // 最低工资基数
    avgWage: null, // 当地社平工资
    result: null,
    showDetail: false,
    detailProcess: '',
    showTip1: false, // 无过失性辞退相关法律法规提示展开状态
    showTip2: false,  // 什么是法律规定的经济性裁员提示展开状态
    collapsing1: false, // 第一个提示的收起动画状态
    collapsing2: false  // 第二个提示的收起动画状态
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  calculate: function() {
    const { n, p, minWage, avgWage } = this.data;
    if (n === null || p === null || minWage === null || avgWage === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const nVal = parseFloat(n) || 0;
    const pVal = parseFloat(p) || 0;
    const minWageVal = parseFloat(minWage) || 0;
    const avgWageVal = parseFloat(avgWage) || 0;

    // 应用最低工资基数限制
    const adjustedP = Math.max(pVal, minWageVal);
    
    // 计算经济补偿金
    let compensation = 0;
    if (nVal > 0 && nVal < 6) {
      compensation = 0.5 * adjustedP;
    } else if (nVal >= 6) {
      // 实现 F(x) 和 A(x) 函数
      const x = nVal / 12;
      const F = this.F(x);
      const A = this.A(x - F);
      compensation = (F + A * (x - F)) * adjustedP;
    }

    // 应用"双封顶"规则
    const cap = Math.min(12, nVal/12) * Math.min(3 * avgWageVal, adjustedP);
    const finalCompensation = Math.min(compensation, cap);
    
    // 计算经济赔偿金（经济补偿金的二倍）
    const compensationDouble = 2 * finalCompensation;
    
    // 计算代通知金（与经济补偿金相同）
    const noticePay = finalCompensation;

    // 生成详细计算过程
    const detailProcess = `计算公式：
经济补偿金计算标准:
当N∈(0,6)时，W=0.5*P
当N≥6时，W=(F(N/12)+A(N/12-F(N/12)))*P

输入数据：
• 用工月数(N)：${nVal} 个月
• 前十二个月的平均工资(P)：${pVal} 元
• 最低工资基数：${minWageVal} 元
• 当地社平工资：${avgWageVal} 元

计算过程：
第一步：调整工资基数
比较平均工资与最低工资基数
调整后工资基数 = max(${pVal}, ${minWageVal}) = ${adjustedP} 元

第二步：计算经济补偿金
工作月数：${nVal} 个月
- 如果 ∈ (0,6)：补偿金 = 0.5 × ${adjustedP}
- 如果 ≥ 6：补偿金 = (F(${(nVal/12).toFixed(2)}) + A(${(nVal/12).toFixed(2)} - F(${(nVal/12).toFixed(2)}))) × ${adjustedP}

当前工作月数：${nVal} 个月
经济补偿金：${compensation.toFixed(2)} 元

第三步：应用"双封顶"规则
封顶限制 = min(12年, ${nVal/12}年) × min(3 × ${avgWageVal}, ${adjustedP})
         = ${Math.min(12, nVal/12)} × ${Math.min(3 * avgWageVal, adjustedP).toFixed(2)}
         = ${cap.toFixed(2)} 元

最终经济补偿金 = min(${compensation.toFixed(2)}, ${cap.toFixed(2)}) = ${finalCompensation.toFixed(2)} 元

第四步：计算相关费用
经济赔偿金 = 2 × ${finalCompensation.toFixed(2)} = ${compensationDouble.toFixed(2)} 元
代通知金 = ${noticePay.toFixed(2)} 元 （与经济补偿金相同）`;

    this.setData({
      result: {
        compensation: finalCompensation.toFixed(2),
        compensationDouble: compensationDouble.toFixed(2),
        noticePay: noticePay.toFixed(2)
      },
      detailProcess: detailProcess,
      showDetail: false
    });
  },

  // F(x) 函数实现
  F: function(x) {
    // F(x) = A, A <= X <= A+1
    // 这里我们实现为取整函数
    const A = Math.floor(x);
    return A;
  },

  // A(x) 函数实现
  A: function(x) {
    // A(x) = 1 (x∈[0.5,1)), 0.5 (x∈(0,0.5))
    if (x >= 0.5 && x < 1) {
      return 1;
    } else if (x > 0 && x < 0.5) {
      return 0.5;
    } else {
      return 0; // 对于其他情况返回0
    }
  },

  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  // 切换第一个提示的显示状态
  toggleTip1: function() {
    if (this.data.showTip1) {
      // 添加收起动画
      this.setData({
        collapsing1: true
      });
      
      // 动画结束后隐藏内容
      setTimeout(() => {
        this.setData({
          showTip1: false,
          collapsing1: false
        });
      }, 300);
    } else {
      // 直接显示内容（展开动画由CSS控制）
      this.setData({
        showTip1: true
      });
    }
  },

  // 切换第二个提示的显示状态
  toggleTip2: function() {
    if (this.data.showTip2) {
      // 添加收起动画
      this.setData({
        collapsing2: true
      });
      
      // 动画结束后隐藏内容
      setTimeout(() => {
        this.setData({
          showTip2: false,
          collapsing2: false
        });
      }, 300);
    } else {
      // 直接显示内容（展开动画由CSS控制）
      this.setData({
        showTip2: true
      });
    }
  },

  copyResult: function() {
    if (this.data.result === null) {
      wx.showToast({
        title: '没有计算结果可复制',
        icon: 'none'
      });
      return;
    }
    
    const { n, p, minWage, avgWage } = this.data;
    const nVal = parseFloat(n) || 0;
    const pVal = parseFloat(p) || 0;
    const minWageVal = parseFloat(minWage) || 0;
    const avgWageVal = parseFloat(avgWage) || 0;

    // 应用最低工资基数限制
    const adjustedP = Math.max(pVal, minWageVal);
    
    // 计算经济补偿金
    let compensation = 0;
    if (nVal > 0 && nVal < 6) {
      compensation = 0.5 * adjustedP;
    } else if (nVal >= 6) {
      const x = nVal / 12;
      const F = this.F(x);
      const A = this.A(x - F);
      compensation = (F + A * (x - F)) * adjustedP;
    }

    // 应用"双封顶"规则
    const cap = Math.min(12, nVal/12) * Math.min(3 * avgWageVal, adjustedP);
    const finalCompensation = Math.min(compensation, cap);
    
    // 计算经济赔偿金（经济补偿金的二倍）
    const compensationDouble = 2 * finalCompensation;
    
    // 计算代通知金（与经济补偿金相同）
    const noticePay = finalCompensation;

    const resultText = `【经济补偿金计算结果】
    
计算公式：
经济补偿金计算标准:
当N∈(0,6)时，W=0.5*P
当N≥6时，W=(F(N/12)+A(N/12-F(N/12)))*P

输入数据：
• 用工月数(N)：${nVal} 个月
• 前十二个月的平均工资(P)：${pVal} 元
• 最低工资基数：${minWageVal} 元
• 当地社平工资：${avgWageVal} 元

计算过程：
第一步：调整工资基数
比较平均工资与最低工资基数
调整后工资基数 = max(${pVal}, ${minWageVal}) = ${adjustedP} 元

第二步：计算经济补偿金
工作月数：${nVal} 个月
- 如果 ∈ (0,6)：补偿金 = 0.5 × ${adjustedP}
- 如果 ≥ 6：补偿金 = (F(${(nVal/12).toFixed(2)}) + A(${(nVal/12).toFixed(2)} - F(${(nVal/12).toFixed(2)}))) × ${adjustedP}

当前工作月数：${nVal} 个月
经济补偿金：${compensation.toFixed(2)} 元

第三步：应用"双封顶"规则
封顶限制 = min(12年, ${nVal/12}年) × min(3 × ${avgWageVal}, ${adjustedP})
         = ${Math.min(12, nVal/12)} × ${Math.min(3 * avgWageVal, adjustedP).toFixed(2)}
         = ${cap.toFixed(2)} 元

最终经济补偿金 = min(${compensation.toFixed(2)}, ${cap.toFixed(2)}) = ${finalCompensation.toFixed(2)} 元

第四步：计算相关费用
经济赔偿金 = 2 × ${finalCompensation.toFixed(2)} = ${compensationDouble.toFixed(2)} 元
代通知金 = ${noticePay.toFixed(2)} 元 （与经济补偿金相同）

最终结果：
• 经济补偿金：${finalCompensation.toFixed(2)} 元
• 经济赔偿金：${compensationDouble.toFixed(2)} 元
• 代通知金：${noticePay.toFixed(2)} 元`;
    
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
    const shareTitle = result ? `我用经济补偿金计算器算出了${result.compensation}元，快来试试吧！` : '经济补偿金计算器，快来计算你的补偿金！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/economic-compensation/economic-compensation',
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
