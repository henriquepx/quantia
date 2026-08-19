import { CalculatorConfig } from './types';

export const creditCardsCalculators: CalculatorConfig[] = [
  {
    id: 'minimum-payment',
    slug: 'minimum-payment',
    title: 'Minimum Payment Trap',
    description: 'See how long it takes to pay off a balance by paying only the minimum.',
    category: 'credit-cards',
    icon: 'CreditCard',
    fields: [
      { id: 'balance', label: 'Credit Card Balance (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'rate', label: 'Monthly Interest Rate (%)', type: 'percent', defaultValue: 14 },
      { id: 'minPercent', label: 'Minimum Payment (%)', type: 'percent', defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const balance = Number(inputs.balance) || 0;
      const rate = (Number(inputs.rate) || 0) / 100;
      const minP = (Number(inputs.minPercent) || 0) / 100;
      
      if (minP <= rate) {
        return [
          { label: 'Status', value: 'Never pays off (Min < Interest)', type: 'text', highlight: true },
        ];
      }
      
      let currentBalance = balance;
      let months = 0;
      let totalPaid = 0;
      
      while (currentBalance > 0 && months < 600) {
        let payment = currentBalance * minP;
        if (payment < 50) payment = Math.min(currentBalance + currentBalance * rate, 50); // min absolute payment
        
        const interest = currentBalance * rate;
        totalPaid += payment;
        currentBalance = currentBalance + interest - payment;
        months++;
        if (currentBalance < 0.01) break;
      }
      
      return [
        { label: 'Months to Pay Off', value: months, type: 'number', highlight: true },
        { label: 'Total Paid', value: totalPaid, type: 'currency' },
        { label: 'Total Interest', value: totalPaid - balance, type: 'currency' },
      ];
    },
    explanation: 'Paying only the minimum on a credit card maximizes the interest the bank collects and extends the debt for years.',
  },
  {
    id: 'revolving-interest',
    slug: 'revolving-interest',
    title: 'Revolving Interest',
    description: 'Calculate interest added when rolling over your credit card balance.',
    category: 'credit-cards',
    icon: 'RefreshCcw',
    fields: [
      { id: 'balance', label: 'Rolled Balance (R$)', type: 'currency', defaultValue: 2000 },
      { id: 'days', label: 'Days Rolled', type: 'number', defaultValue: 30 },
      { id: 'rate', label: 'Monthly Rate (%)', type: 'percent', defaultValue: 14 },
    ],
    calculate: (inputs) => {
      const balance = Number(inputs.balance) || 0;
      const days = Number(inputs.days) || 0;
      const rate = (Number(inputs.rate) || 0) / 100;
      
      const dailyRate = Math.pow(1 + rate, 1/30) - 1;
      const newBalance = balance * Math.pow(1 + dailyRate, days);
      const interest = newBalance - balance;
      
      return [
        { label: 'Interest for Period', value: interest, type: 'currency', highlight: true },
        { label: 'New Balance', value: newBalance, type: 'currency' },
        { label: 'Daily Rate', value: dailyRate * 100, type: 'percent' },
      ];
    },
    explanation: 'Credit card interest (rotativo) is compounded daily in most cases, making it one of the most expensive types of debt.',
  },
  {
    id: 'installment-purchase',
    slug: 'installment-purchase',
    title: 'Installment vs Cash',
    description: 'Compare paying cash with a discount vs paying in installments.',
    category: 'credit-cards',
    icon: 'ShoppingBag',
    fields: [
      { id: 'cashPrice', label: 'Cash Price (R$)', type: 'currency', defaultValue: 900 },
      { id: 'installmentPrice', label: 'Total Installment Price (R$)', type: 'currency', defaultValue: 1000 },
      { id: 'installments', label: 'Number of Installments', type: 'number', defaultValue: 10 },
      { id: 'investmentRate', label: 'Your Investment Return Rate (% p.m.)', type: 'percent', defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const cashPrice = Number(inputs.cashPrice) || 0;
      const installmentPrice = Number(inputs.installmentPrice) || 0;
      const n = Number(inputs.installments) || 1;
      const r = (Number(inputs.investmentRate) || 0) / 100;
      
      const pmt = installmentPrice / n;
      let pvInstallments = 0;
      for (let i=1; i<=n; i++) {
        pvInstallments += pmt / Math.pow(1 + r, i);
      }
      
      const betterCash = cashPrice < pvInstallments;
      
      return [
        { label: 'Recommendation', value: betterCash ? 'Pay Cash' : 'Pay Installments', type: 'text', highlight: true },
        { label: 'Present Value of Installments', value: pvInstallments, type: 'currency' },
        { label: 'Savings if paying cash', value: Math.max(0, pvInstallments - cashPrice), type: 'currency' },
      ];
    },
    explanation: 'If the discount offered for paying cash is greater than what you could earn by leaving the money invested and paying installments, you should pay cash.',
  },
  {
    id: 'cashback',
    slug: 'cashback',
    title: 'Cashback Calculator',
    description: 'Calculate how much you can earn in cashback over a year.',
    category: 'credit-cards',
    icon: 'Wallet',
    fields: [
      { id: 'monthlySpend', label: 'Monthly Card Spending (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'cashbackRate', label: 'Cashback Rate (%)', type: 'percent', defaultValue: 1.5 },
      { id: 'cardFee', label: 'Monthly Card Fee (R$)', type: 'currency', defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const spend = Number(inputs.monthlySpend) || 0;
      const rate = (Number(inputs.cashbackRate) || 0) / 100;
      const fee = Number(inputs.cardFee) || 0;
      
      const monthlyCashback = spend * rate;
      const netMonthly = monthlyCashback - fee;
      const netAnnual = netMonthly * 12;
      
      return [
        { label: 'Net Annual Cashback', value: netAnnual, type: 'currency', highlight: true },
        { label: 'Monthly Cashback', value: monthlyCashback, type: 'currency' },
        { label: 'Is it worth the fee?', value: netMonthly > 0 ? 'Yes' : 'No', type: 'text' },
      ];
    },
    explanation: 'Ensure your cashback earnings exceed any annual or monthly fees the card might charge.',
  },
  {
    id: 'reward-points',
    slug: 'reward-points',
    title: 'Reward Points Value',
    description: 'Calculate the true monetary value of your credit card points.',
    category: 'credit-cards',
    icon: 'Gift',
    fields: [
      { id: 'spend', label: 'Monthly Spend (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'pointsPerDolar', label: 'Points per US$', type: 'number', defaultValue: 2 },
      { id: 'usdRate', label: 'Exchange Rate (R$/US$)', type: 'number', defaultValue: 5 },
      { id: 'milheiroValue', label: 'Value of 1000 points (R$)', type: 'currency', defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const spend = Number(inputs.spend) || 0;
      const pts = Number(inputs.pointsPerDolar) || 0;
      const usd = Number(inputs.usdRate) || 1;
      const milheiro = Number(inputs.milheiroValue) || 0;
      
      const pointsMonthly = (spend / usd) * pts;
      const valueMonthly = (pointsMonthly / 1000) * milheiro;
      const returnRate = (valueMonthly / spend) * 100;
      
      return [
        { label: 'Points Earned (Monthly)', value: pointsMonthly, type: 'number', highlight: true },
        { label: 'Value in R$ (Monthly)', value: valueMonthly, type: 'currency' },
        { label: 'Equivalent Cashback', value: returnRate, type: 'percent' },
      ];
    },
    explanation: 'Converting points to cash equivalent helps compare points cards directly with cashback cards.',
  },
  {
    id: 'cost-simulator',
    slug: 'cost-simulator',
    title: 'Credit Card Cost Simulator',
    description: 'Simulate the annual cost of credit card use and debt.',
    category: 'credit-cards',
    icon: 'AlertTriangle',
    fields: [
      { id: 'avgBalance', label: 'Average Rolled Balance (R$)', type: 'currency', defaultValue: 1000 },
      { id: 'rate', label: 'Monthly Rate (%)', type: 'percent', defaultValue: 14 },
      { id: 'annualFee', label: 'Annual Card Fee (R$)', type: 'currency', defaultValue: 300 },
    ],
    calculate: (inputs) => {
      const bal = Number(inputs.avgBalance) || 0;
      const rate = (Number(inputs.rate) || 0) / 100;
      const fee = Number(inputs.annualFee) || 0;
      
      const annualRate = Math.pow(1 + rate, 12) - 1;
      const annualInterest = bal * annualRate;
      
      return [
        { label: 'Total Annual Cost', value: annualInterest + fee, type: 'currency', highlight: true },
        { label: 'Annual Interest Paid', value: annualInterest, type: 'currency' },
        { label: 'Equivalent Annual Rate', value: annualRate * 100, type: 'percent' },
      ];
    },
    explanation: 'Rolling over even a small balance on a high-interest credit card can quickly exceed the value of the original purchases.',
  }
];
