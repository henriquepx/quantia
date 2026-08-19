import { CalculatorConfig } from './types';

export const investmentsCalculators: CalculatorConfig[] = [
  {
    id: 'compound-interest',
    slug: 'compound-interest',
    title: 'Compound Interest',
    description: 'Calculate the growth of your investments over time with compound interest.',
    category: 'investments',
    icon: 'LineChart',
    fields: [
      { id: 'principal', label: 'Initial Amount (R$)', type: 'currency', defaultValue: 1000 },
      { id: 'monthly', label: 'Monthly Contribution (R$)', type: 'currency', defaultValue: 100 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'percent', defaultValue: 10 },
      { id: 'years', label: 'Period (Years)', type: 'number', defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const m = Number(inputs.monthly) || 0;
      const r = (Number(inputs.rate) || 0) / 100;
      const y = Number(inputs.years) || 0;
      
      const monthlyRate = Math.pow(1 + r, 1/12) - 1;
      const months = y * 12;
      
      let futureValue = p * Math.pow(1 + monthlyRate, months);
      if (m > 0 && monthlyRate > 0) {
        futureValue += m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      }
      
      const totalInvested = p + (m * months);
      const totalInterest = futureValue - totalInvested;
      
      return [
        { label: 'Final Amount', value: futureValue, type: 'currency', highlight: true },
        { label: 'Total Invested', value: totalInvested, type: 'currency' },
        { label: 'Total Interest', value: totalInterest, type: 'currency' },
      ];
    },
    explanation: 'Compound interest is the interest on savings calculated on both the initial principal and the accumulated interest from previous periods.',
    formula: 'A = P(1 + r/n)^(nt) + PMT × [(1+r/n)^(nt) - 1] / (r/n)',
  },
  {
    id: 'simple-interest',
    slug: 'simple-interest',
    title: 'Simple Interest',
    description: 'Calculate basic interest without compounding.',
    category: 'investments',
    icon: 'Percent',
    fields: [
      { id: 'principal', label: 'Principal (R$)', type: 'currency', defaultValue: 1000 },
      { id: 'rate', label: 'Interest Rate (%)', type: 'percent', defaultValue: 10 },
      { id: 'period', label: 'Period', type: 'number', defaultValue: 5 },
      { id: 'periodType', label: 'Period Type', type: 'select', defaultValue: 'years', options: [{value:'months', label:'Months'}, {value:'years', label:'Years'}] },
      { id: 'rateType', label: 'Rate Type', type: 'select', defaultValue: 'yearly', options: [{value:'monthly', label:'Monthly'}, {value:'yearly', label:'Yearly'}] }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = (Number(inputs.rate) || 0) / 100;
      const t = Number(inputs.period) || 0;
      
      let adjustedT = t;
      let adjustedR = r;
      if (inputs.periodType === 'years' && inputs.rateType === 'monthly') adjustedT = t * 12;
      if (inputs.periodType === 'months' && inputs.rateType === 'yearly') adjustedT = t / 12;
      
      const interest = p * adjustedR * adjustedT;
      return [
        { label: 'Total Amount', value: p + interest, type: 'currency', highlight: true },
        { label: 'Total Interest', value: interest, type: 'currency' }
      ];
    },
    explanation: 'Simple interest is calculated only on the principal amount, or on that portion of the principal amount that remains unpaid.',
    formula: 'A = P(1 + rt)',
  },
  {
    id: 'tesouro-direto',
    slug: 'tesouro-direto',
    title: 'Tesouro Direto',
    description: 'Simulate returns for Brazilian government bonds (Tesouro Direto).',
    category: 'investments',
    icon: 'Landmark',
    fields: [
      { id: 'principal', label: 'Initial Amount (R$)', type: 'currency', defaultValue: 1000 },
      { id: 'rate', label: 'Fixed Rate (% a.a.)', type: 'percent', defaultValue: 5.5 },
      { id: 'ipca', label: 'Expected IPCA (% a.a.)', type: 'percent', defaultValue: 4.0 },
      { id: 'years', label: 'Period (Years)', type: 'number', defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = (Number(inputs.rate) || 0) / 100;
      const ipca = (Number(inputs.ipca) || 0) / 100;
      const y = Number(inputs.years) || 0;
      
      const nominalRate = ((1 + r) * (1 + ipca)) - 1;
      const grossFinal = p * Math.pow(1 + nominalRate, y);
      const profit = grossFinal - p;
      
      const days = y * 365;
      let taxRate = 0.225;
      if (days > 180) taxRate = 0.20;
      if (days > 360) taxRate = 0.175;
      if (days > 720) taxRate = 0.15;
      
      const netProfit = profit * (1 - taxRate);
      const b3Fee = 0.002 * p * y;
      const netFinal = p + netProfit - b3Fee;
      
      return [
        { label: 'Net Amount', value: netFinal, type: 'currency', highlight: true },
        { label: 'Gross Amount', value: grossFinal, type: 'currency' },
        { label: 'Net Profit', value: netProfit, type: 'currency' },
        { label: 'IR Deducted', value: profit * taxRate, type: 'currency' },
      ];
    },
    explanation: 'Tesouro Direto allows individuals to buy government bonds. IPCA+ bonds yield a fixed rate plus inflation. Returns are subject to income tax (IR) on a regressive scale, plus B3 custody fees.',
  },
  {
    id: 'cdb',
    slug: 'cdb',
    title: 'CDB (Bank Deposit Certificate)',
    description: 'Calculate net returns on CDBs considering income tax.',
    category: 'investments',
    icon: 'Building',
    fields: [
      { id: 'principal', label: 'Investment (R$)', type: 'currency', defaultValue: 10000 },
      { id: 'rate', label: '% of CDI', type: 'percent', defaultValue: 110 },
      { id: 'cdi', label: 'Current CDI Rate (% a.a.)', type: 'percent', defaultValue: 10.65 },
      { id: 'days', label: 'Period (Days)', type: 'number', defaultValue: 365 },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const rateCdi = (Number(inputs.rate) || 0) / 100;
      const cdi = (Number(inputs.cdi) || 0) / 100;
      const d = Number(inputs.days) || 0;
      
      const annualRate = cdi * rateCdi;
      const dailyRate = Math.pow(1 + annualRate, 1/252) - 1; 
      const workingDays = Math.floor(d * (252/365));
      const grossFinal = p * Math.pow(1 + dailyRate, workingDays);
      const profit = grossFinal - p;
      
      let taxRate = 0.225;
      if (d > 180) taxRate = 0.20;
      if (d > 360) taxRate = 0.175;
      if (d > 720) taxRate = 0.15;
      
      const netProfit = profit * (1 - taxRate);
      
      return [
        { label: 'Net Final Amount', value: p + netProfit, type: 'currency', highlight: true },
        { label: 'Gross Profit', value: profit, type: 'currency' },
        { label: 'Income Tax', value: profit * taxRate, type: 'currency' },
        { label: 'Net Profit', value: netProfit, type: 'currency' },
      ];
    },
    explanation: 'CDBs are bank securities. Returns are often pegged to the CDI rate. They are subject to the standard regressive income tax table.',
  }
];
