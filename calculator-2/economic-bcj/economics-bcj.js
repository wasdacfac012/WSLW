Page({
  data: {
    n: null,
    w: null,
    aw: null,
    result: null,
    showDetail: false,
    showExplanation: false, // 添加说明内容展开/收起状态
    detailProcess: ''
  },

  bindKeyInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  calculate: function() {
    const { n, w, aw } = this.data;
    if (n === null || w === null || aw === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const nVal = parseFloat(n) || 0;
    var wVal = parseFloat(w) || 0;
    var awVal = parseFloat(aw) || 0;

    let nm = 0;
    if (nVal < 6) nm = 0.5;
    else if (nVal < 12) nm = 1;
    else nm = Math.floor(nVal/12) + (nVal % 12 > 6 ? 1 : (nVal % 12 > 0 ? 0.5 : 0));
    
    // 应用双封顶规则
    let isCapped = false;
    let cappedReason = '';
    
    // 规则1: 如果离职前平均工资超过上年度社会平均工资3倍，按3倍计算
    if (wVal > 3 * awVal) {
      wVal = 3 * awVal;
      isCapped = true;
      cappedReason = '（根据双封顶规则，因离职前平均工资超过上年度社会平均工资3倍，按3倍计算）';
    } else if(wVal < awVal) {
      wVal = awVal;
    }

    // 计算基础经济补偿金
    let result = nm * wVal;
    
    // 规则2: 如果应用了双封顶规则，经济补偿金总额不得超过12个月
    if (isCapped && result > 12 * wVal) {
      result = 12 * wVal;
      cappedReason += '\n（根据双封顶规则，经济补偿金总额不得超过12个月工资）';
    }

    // 生成详细计算过程
    const detailProcess = `计算公式：经济补偿金 = 补偿年限 × 月工资 

输入数据：
• 工作月数(N)：${nVal} 个月
• 离职前平均应得工资(W)：${parseFloat(w) || 0} 元
• 上年度职工平均工资(AW)：${awVal} 元

计算过程：
第一步：计算补偿年限系数
工作月数：${nVal} 个月
- 如果 < 6个月：系数 = 0.5
- 如果 6-11个月：系数 = 1  
- 如果 ≥ 12个月：系数 = 完整年数 + 余月系数
  (余月 > 6个月按1年算，≤ 6个月按0.5年算)

当前工作月数：${nVal} 个月
补偿年限系数：${nm}

第二步：确定工资基数
${isCapped ? 
  `检测到离职前平均工资(${parseFloat(w) || 0}元) ${parseFloat(w) || 0 > 3 * awVal ? 
    `超过上年度社会平均工资的3倍(${3 * awVal}元)` : 
    `未超过上年度社会平均工资的3倍(${3 * awVal}元)`}
工资基数：${wVal} 元 ${cappedReason}` : 
  `比较离职前平均工资与上年度社会平均工资，取较高者作为工资基数
如果月平均工资${parseFloat(w) || 0}小于社会平均工资${awVal},那么工资基数为后者,反之为前者 
工资基数：${wVal} 元`}

第三步：计算最终经济补偿金
经济补偿金 = ${nm} × ${wVal} = ${result} 元`;

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

  toggleExplanation: function() {
    this.setData({
      showExplanation: !this.data.showExplanation
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
    
    const { n, w, aw } = this.data;
    const nVal = parseFloat(n) || 0;
    let wVal = parseFloat(w) || 0;
    const awVal = parseFloat(aw) || 0;
    
    let nm = 0;
    if (nVal < 6) nm = 0.5;
    else if (nVal < 12) nm = 1;
    else nm = Math.floor(nVal/12) + (nVal % 12 > 6 ? 1 : (nVal % 12 > 0 ? 0.5 : 0));
    
    // 应用双封顶规则
    let isCapped = false;
    let cappedReason = '';
    
    // 规则1: 如果离职前平均工资超过上年度社会平均工资3倍，按3倍计算
    if (wVal > 3 * awVal) {
      wVal = 3 * awVal;
      isCapped = true;
      cappedReason = '（根据双封顶规则，因离职前平均工资超过上年度社会平均工资3倍，按3倍计算）';
    } else if(wVal < awVal) {
      wVal = awVal;
    }

    // 计算基础经济补偿金
    let result = nm * wVal;
    
    // 规则2: 如果应用了双封顶规则，经济补偿金总额不得超过12个月
    if (isCapped && result > 12 * wVal) {
      result = 12 * wVal;
      cappedReason += '\n（根据双封顶规则，经济补偿金总额不得超过12个月工资）';
    }
    
    const resultText = `【经济补偿金计算】
    
计算公式：经济补偿金 = 补偿年限系数 × 月工资

输入数据：
• 工作月数(N)：${nVal} 个月
• 离职前平均应得工资(W)：${parseFloat(w) || 0} 元
• 上年度职工平均工资(AW)：${awVal} 元

计算过程：
第一步：计算补偿年限系数
工作月数：${nVal} 个月
- 如果 < 6个月：系数 = 0.5
- 如果 6-11个月：系数 = 1  
- 如果 ≥ 12个月：系数 = 完整年数 + 余月系数
  (余月 > 6个月按1年算，≤ 6个月按0.5年算)

当前工作月数：${nVal} 个月
补偿年限系数：${nm}

第二步：确定工资基数
${isCapped ? 
  `检测到离职前平均工资(${parseFloat(w) || 0}元) ${parseFloat(w) || 0 > 3 * awVal ? 
    `超过上年度社会平均工资的3倍(${3 * awVal}元)` : 
    `未超过上年度社会平均工资的3倍(${3 * awVal}元)`}
工资基数：${wVal} 元 ${cappedReason}` : 
  `比较离职前平均工资与上年度社会平均工资，取较高者作为工资基数
如果月平均工资${parseFloat(w) || 0}小于社会平均工资${awVal},那么工资基数为后者,反之为前者 
工资基数：${wVal} 元`}

第三步：计算最终经济补偿金
经济补偿金 = ${nm} × ${wVal} = ${result} 元

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
    const shareTitle = result ? `我用经济补偿金计算器算出了${result}元，快来试试吧！` : '经济补偿金计算器，快来计算你的补偿金！';
    
    return {
      title: shareTitle,
      path: '/economic-bcj/economics-bcj',
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
