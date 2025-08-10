Page({
  data: {
    n: null,
    w: null,
    aw: null,
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
    if(wVal<awVal)
    {
      wVal=awVal
    }

    
    const result = nm * wVal*2;

    // 生成详细计算过程
    const detailProcess = `计算公式：经济赔偿金 = 补偿年限系数 × 月工资 × 2

输入数据：
• 工作月数(N)：${nVal} 个月
• 月工资(W)：${wVal} 元
• 上年度平均工资(AW)：${awVal} 元

计算过程：
第一步：计算补偿年限系数
工作月数：${nVal} 个月
- 如果 < 6个月：系数 = 0.5
- 如果 6-11个月：系数 = 1  
- 如果 ≥ 12个月：系数 = 完整年数 + 余月系数
  (余月 > 6个月按1年算，≤ 6个月按0.5年算)

当前工作月数：${nVal} 个月
补偿年限系数：${nm}
计算工资基数
如果月平均工资${wVal}小于社会平均工资${awVal},那么工资基数为后者,反之为前者 
工资基数${wVal=Math.max(wVal,awVal)}
第二步：计算最终经济赔偿金
经济赔偿金 = ${nm} × ${wVal} × 2 = ${(nm * wVal).toFixed(2)*2} 元`;

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
    
    const { n, w, aw } = this.data;
    const nVal = parseFloat(n) || 0;
    const wVal = parseFloat(w) || 0;
    const awVal = parseFloat(aw) || 0;
    
    let nm = 0;
    if (nVal < 6) nm = 0.5;
    else if (nVal < 12) nm = 1;
    else nm = Math.floor(nVal/12) + (nVal % 12 > 6 ? 1 : (nVal % 12 > 0 ? 0.5 : 0));
    
    const cap = 12 * Math.min(3 * awVal, wVal);
    
    const resultText = `【经济补偿金计算】
    
计算公式：经济赔偿金 =补偿年限系数 × 月工资× 2

输入数据：
• 工作月数(N)：${nVal} 个月
• 月工资(W)：${wVal} 元
• 上年度平均工资(AW)：${awVal} 元

计算过程：
第一步：计算补偿年限系数
工作月数：${nVal} 个月
- 如果 < 6个月：系数 = 0.5
- 如果 6-11个月：系数 = 1  
- 如果 ≥ 12个月：系数 = 完整年数 + 余月系数
  (余月 > 6个月按1年算，≤ 6个月按0.5年算)
计算工资基数
如果月平均工资${wVal}小于社会平均工资${awVal},那么工资基数为后者,反之为前者 
工资基数${wVal=Math.max(wVal,awVal)}
当前工作月数：${nVal} 个月
补偿年限系数：${nm}



第三步：计算最终经济赔偿金
基本补偿 = ${nm} × ${wVal} × 2 = ${(nm * wVal).toFixed(2)} 元
经济补偿金 = (nm * wVal).toFixed(2)} = ${this.data.result} 元

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
    const shareTitle = result ? `我用经济赔偿金计算器算出了${result}元，快来试试吧！` : '经济赔偿金计算器，快来计算你的赔偿金！';
    
    return {
      title: shareTitle,
      path: '/severance-pay/severance-pay',
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
