Page({
  data: {
    // Input data
    infringementDate: '', // 知道/应知权利被侵害之日
    selectedTypeIndex: 0, // 选中的类型索引
    typeOptions: [
      '仲裁:除工伤医疗费和在职拖欠劳动报酬外的劳动争议',
      '仲裁:工伤医疗费',
      '诉讼:非工伤/医疗期外争议',
      '工伤认定'
    ],
    
    // Result data
    result: null,
    showDetail: false,
    detailProcess: '',
    
    // Expandable sections
    showTip1: false, // 劳动仲裁时效提示展开状态
    showTip2: false,  // 劳动纠纷诉讼时效提示展开状态
    collapsing1: false, // 第一个提示的收起动画状态
    collapsing2: false  // 第二个提示的收起动画状态
  },

  // 处理日期输入
  bindDateChange: function(e) {
    this.setData({
      infringementDate: e.detail.value
    });
  },

  // 处理类型选择
  bindTypeChange: function(e) {
    this.setData({
      selectedTypeIndex: parseInt(e.detail.value)
    });
  },

  // 计算仲裁/诉讼时效
  calculate: function() {
    const { infringementDate, selectedTypeIndex } = this.data;
    
    if (!infringementDate) {
      wx.showToast({
        title: '请选择权利被侵害日期',
        icon: 'none'
      });
      return;
    }
    
    // 解析日期
    const dateParts = infringementDate.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // JavaScript月份从0开始
    const day = parseInt(dateParts[2]);
    
    const infringementDateObj = new Date(year, month, day);
    
    // 计算结果
    let resultDateObj = new Date(infringementDateObj);
    let description = '';
    let detailProcess = '';
    
    switch (selectedTypeIndex) {
      case 0: // 仲裁:除工伤医疗费和在职拖欠劳动报酬外的劳动争议
        resultDateObj.setFullYear(resultDateObj.getFullYear() + 1);
        description = '一般仲裁时效为1年';
        detailProcess = `根据《劳动争议调解仲裁法》规定，一般劳动争议仲裁时效为1年，自知道或应当知道权利被侵害之日起计算。`;
        break;
        
      case 1: // 仲裁:工伤医疗费
        resultDateObj.setFullYear(resultDateObj.getFullYear() + 1);
        description = '工伤医疗费仲裁时效为劳动关系终止后1年内';
        detailProcess = `工伤医疗费争议的仲裁时效为劳动关系终止后1年内提出。请注意，此日期为劳动关系终止后的1年内，而非权利被侵害之日起算。`;
        break;
        
      case 2: // 诉讼:非工伤/医疗期外争议
        resultDateObj.setFullYear(resultDateObj.getFullYear() + 1);
        description = '一般诉讼时效为1年';
        detailProcess = `非工伤或医疗期外争议的诉讼时效为1年，自知道或应当知道权利被侵害之日起计算。`;
        break;
        
      case 3: // 工伤认定
        resultDateObj.setDate(resultDateObj.getDate() + 30);
        description = '工伤认定申请时效为30日内';
        detailProcess = `工伤认定申请的时效为30日内，逾期将丧失申请权利。`;
        break;
        
      default:
        wx.showToast({
          title: '请选择正确的类型',
          icon: 'none'
        });
        return;
    }
    
    // 格式化结果日期
    const resultYear = resultDateObj.getFullYear();
    const resultMonth = (resultDateObj.getMonth() + 1).toString().padStart(2, '0');
    const resultDay = resultDateObj.getDate().toString().padStart(2, '0');
    const resultDateString = `${resultYear}-${resultMonth}-${resultDay}`;
    
    // 生成详细过程
    const infringementYear = infringementDateObj.getFullYear();
    const infringementMonth = (infringementDateObj.getMonth() + 1).toString().padStart(2, '0');
    const infringementDay = infringementDateObj.getDate().toString().padStart(2, '0');
    const infringementDateString = `${infringementYear}-${infringementMonth}-${infringementDay}`;
    
    const typeDescription = this.data.typeOptions[selectedTypeIndex];
    
    const fullDetailProcess = `${detailProcess}

输入信息：
• 权利被侵害日期：${infringementDateString}
• 争议类型：${typeDescription}

计算结果：
• 最晚申请日期：${resultDateString}
• 说明：${description}`;
    
    this.setData({
      result: {
        date: resultDateString,
        description: description
      },
      detailProcess: fullDetailProcess,
      showDetail: false
    });
  },

  // 切换详细信息显示
  toggleDetail: function() {
    this.setData({
      showDetail: !this.data.showDetail
    });
  },

  // 切换第一个提示的显示状态（劳动仲裁时效）
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

  // 切换第二个提示的显示状态（劳动纠纷诉讼时效）
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

  // 复制结果
  copyResult: function() {
    if (this.data.result === null) {
      wx.showToast({
        title: '没有计算结果可复制',
        icon: 'none'
      });
      return;
    }
    
    const { infringementDate, selectedTypeIndex, typeOptions, result, detailProcess } = this.data;
    const typeDescription = typeOptions[selectedTypeIndex];
    
    const resultText = `【劳动仲裁/诉讼时效计算结果】

输入信息：
• 权利被侵害日期：${infringementDate}
• 争议类型：${typeDescription}

计算结果：
• 最晚申请日期：${result.date}
• 说明：${result.description}

详细说明：
${detailProcess}`;
    
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
    const shareTitle = result ? `我用劳动仲裁时效计算器算出了${result.date}，快来试试吧！` : '劳动仲裁时效计算器，快来计算你的仲裁时效！';
    
    return {
      title: shareTitle,
      path: '/pages/calculator/labor-arbitration/labor-arbitration',
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
