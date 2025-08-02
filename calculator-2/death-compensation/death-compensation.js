Page({
  data: {
    pn: null,
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
    const { pn } = this.data;
    if (pn === null) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none'
      });
      return;
    }
    
    const pnVal = parseFloat(pn) || 0;
    const result = 20 * pnVal;

    // 生成详细计算过程
    const detailProcess = `计算公式：死亡赔偿金 = 20年 × 上一年度城镇居民人均可支配收入

输入数据：
• 上一年度城镇居民人均可支配收入(Pn)：${pnVal} 元

计算过程：
第一步：确定赔偿年限
根据法律规定，死亡赔偿金按20年计算

第二步：计算死亡赔偿金
死亡赔偿金 = 20 × ${pnVal}
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
    
    const { pn } = this.data;
    const pnVal = parseFloat(pn) || 0;
    
    const resultText = `【死亡赔偿计算】
    
计算公式：死亡赔偿金 = 20年 × 上一年度城镇居民人均可支配收入

输入数据：
• 上一年度城镇居民人均可支配收入(Pn)：${pnVal} 元

计算过程：
第一步：确定赔偿年限
根据法律规定，死亡赔偿金按20年计算

第二步：计算死亡赔偿金
死亡赔偿金 = 20 × ${pnVal}
           = ${this.data.result} 元

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
    const shareTitle = result ? `我用死亡赔偿计算器算出了${result}元，快来试试吧！` : '死亡赔偿计算器，快来计算你的赔偿金！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/death-compensation/death-compensation',
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
