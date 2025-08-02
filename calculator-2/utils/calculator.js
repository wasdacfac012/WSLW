// 计算社保公积金缴费金额
function calculateSocialSecurity(salary, socialBase) {
  // 假设缴费比例（个人部分）
  const pensionRate = 0.08; // 养老保险 8%
  const medicalRate = 0.02; // 医疗保险 2%
  const unemploymentRate = 0.005; // 失业保险 0.5%
  const housingFundRate = 0.06; // 住房公积金 6%（这里取一个中间值）
  
  // 计算各项缴费金额
  const pension = socialBase * pensionRate;
  const medical = socialBase * medicalRate;
  const unemployment = socialBase * unemploymentRate;
  const housingFund = socialBase * housingFundRate;
  
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
  
  // 根据税率表计算个税
  let tax = 0;
  let taxRate = 0;
  let quickDeduction = 0;
  
  if (taxableIncome <= 0) {
    tax = 0;
  } else if (taxableIncome <= 5000) {
    taxRate = 0.05;
    quickDeduction = 0;
    tax = taxableIncome * taxRate - quickDeduction;
  } else if (taxableIncome <= 10000) {
    taxRate = 0.1;
    quickDeduction = 250;
    tax = taxableIncome * taxRate - quickDeduction;
  } else if (taxableIncome <= 30000) {
    taxRate = 0.2;
    quickDeduction = 1250;
    tax = taxableIncome * taxRate - quickDeduction;
  } else if (taxableIncome <= 50000) {
    taxRate = 0.3;
    quickDeduction = 4250;
    tax = taxableIncome * taxRate - quickDeduction;
  } else {
    taxRate = 0.35;
    quickDeduction = 6750;
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
  const minBase = 0.6 * averageSalary;
  const maxBase = 3 * averageSalary;
  const base = Math.max(minBase, Math.min(salary, maxBase));
  
  return base;
}

module.exports = {
  calculateSocialSecurity,
  calculateIndividualIncomeTax,
  calculateSocialBase
};
