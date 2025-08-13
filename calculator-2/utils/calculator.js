// 计算社保公积金缴费金额
function calculateSocialSecurity(salary, socialBase) {
  // 缴费比例（个人部分）
  const pensionRate = 0.08; // 养老保险 8%
  const medicalRate = 0.02; // 医疗保险 2%
  const unemploymentRate = 0.005; // 失业保险 0.5%
  const housingFundRate = 0.06; // 住房公积金 6%（这里取一个中间值）
  
  // 计算各项缴费金额（个人部分）
  const pension = socialBase * pensionRate; // 养老保险
  const medical = socialBase * medicalRate; // 医疗保险
  const unemployment = socialBase * unemploymentRate; // 失业保险
  const housingFund = socialBase * housingFundRate; // 住房公积金
  
  // 个人缴费总额
  const total = pension + medical + unemployment + housingFund;
  
  return {
    pension: pension.toFixed(2),
    medical: medical.toFixed(2),
    unemployment: unemployment.toFixed(2),
    housingFund: housingFund.toFixed(2),
    total: total.toFixed(2)
  };
}

// 计算个人所得税
function calculateIndividualIncomeTax(salary, socialSecurity, specialDeduction = 0) {
  // 计算应纳税所得额
  const taxableIncome = salary - socialSecurity - specialDeduction - 5000;
  
  // 根据新的税率表计算个税
  let tax = 0;
  let taxRate = 0;
  let quickDeduction = 0;
  
  if (taxableIncome <= 0) {
    tax = 0;
  } else if (taxableIncome <= 36000) {
    taxRate = 0.03;
    quickDeduction = 0;
    tax = taxableIncome * taxRate - quickDeduction;
  } else if (taxableIncome <= 144000) {
    taxRate = 0.1;
    quickDeduction = 2520;
    tax = taxableIncome * taxRate - quickDeduction;
  } else if (taxableIncome <= 300000) {
    taxRate = 0.2;
    quickDeduction = 16920;
    tax = taxableIncome * taxRate - quickDeduction;
  } else if (taxableIncome <= 420000) {
    taxRate = 0.25;
    quickDeduction = 31920;
    tax = taxableIncome * taxRate - quickDeduction;
  } else if (taxableIncome <= 660000) {
    taxRate = 0.3;
    quickDeduction = 52920;
    tax = taxableIncome * taxRate - quickDeduction;
  } else if (taxableIncome <= 960000) {
    taxRate = 0.35;
    quickDeduction = 85920;
    tax = taxableIncome * taxRate - quickDeduction;
  } else {
    taxRate = 0.45;
    quickDeduction = 181920;
    tax = taxableIncome * taxRate - quickDeduction;
  }
  
  // 确保税额不为负数
  tax = Math.max(0, tax);
  
  return {
    taxableIncome: taxableIncome.toFixed(2),
    taxRate: (taxRate * 100).toFixed(0),
    quickDeduction: quickDeduction.toFixed(0),
    tax: tax.toFixed(2)
  };
}

// 计算社保公积金基数
function calculateSocialBase(salary, averageSalary) {
  // 社保缴费基数上下限
  // 一般为当地上年度职工月平均工资的60%-300%
  const minBase = 0.6 * averageSalary; // 最低缴费基数
  const maxBase = 3 * averageSalary;   // 最高缴费基数
  
  // 实际缴费基数取值规则：
  // 如果实际工资低于最低基数，按最低基数计算
  // 如果实际工资高于最高基数，按最高基数计算
  // 否则按实际工资计算
  const base = Math.max(minBase, Math.min(salary, maxBase));
  
  return base;
}

module.exports = {
  calculateSocialSecurity,
  calculateIndividualIncomeTax,
  calculateSocialBase
};
