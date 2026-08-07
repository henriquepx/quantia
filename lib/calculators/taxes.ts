import { CalculatorConfig } from './types';

export const taxesCalculators: CalculatorConfig[] = [
  {
    id: 'income-tax',
    slug: 'income-tax',
    title: 'Income Tax (IRPF 2024)',
    description: 'Calculate your monthly Brazilian income tax (IRPF).',
    category: 'taxes',
    icon: 'Receipt',
    fields: [
      { id: 'salary', label: 'Gross Monthly Salary (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'dependents', label: 'Number of Dependents', type: 'number', defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const deps = Number(inputs.dependents) || 0;
      
      let inss = 0;
      if (salary <= 1412) inss = salary * 0.075;
      else if (salary <= 2666.68) inss = 105.9 + (salary - 1412) * 0.09;
      else if (salary <= 4000.03) inss = 105.9 + 112.92 + (salary - 2666.68) * 0.12;
      else if (salary <= 7786.02) inss = 105.9 + 112.92 + 160.00 + (salary - 4000.03) * 0.14;
      else inss = 908.85; 
      
      const dedDeps = deps * 189.59;
      const baseIr = salary - inss - dedDeps;
      
      let ir = 0;
      if (baseIr <= 2259.20) ir = 0;
      else if (baseIr <= 2826.65) ir = (baseIr * 0.075) - 169.44;
      else if (baseIr <= 3751.05) ir = (baseIr * 0.15) - 381.44;
      else if (baseIr <= 4664.68) ir = (baseIr * 0.225) - 662.77;
      else ir = (baseIr * 0.275) - 896.00;
      
      ir = Math.max(0, ir);
      
      const net = salary - inss - ir;
      const effectiveRate = salary > 0 ? (ir / salary) * 100 : 0;
      
      return [
        { label: 'Net Salary', value: net, type: 'currency', highlight: true },
        { label: 'IRPF Deducted', value: ir, type: 'currency' },
        { label: 'INSS Deducted', value: inss, type: 'currency' },
        { label: 'Effective IR Rate', value: effectiveRate, type: 'percent' },
      ];
    },
    explanation: 'Uses the official 2024 progressive tables for both INSS and IRPF, factoring in deductions for dependents.',
  },
  {
    id: 'iof',
    slug: 'iof',
    title: 'IOF Calculator',
    description: 'Calculate the IOF (Imposto sobre Operações Financeiras) for credit operations.',
    category: 'taxes',
    icon: 'Percent',
    fields: [
      { id: 'amount', label: 'Amount (R$)', type: 'currency', defaultValue: 1000 },
      { id: 'days', label: 'Period (Days)', type: 'number', defaultValue: 30 },
      { id: 'type', label: 'Operation Type', type: 'select', defaultValue: 'credit', options: [{value: 'credit', label: 'Credit/Loan'}, {value: 'exchange', label: 'Foreign Exchange (International Card)'}] }
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.amount) || 0;
      const days = Number(inputs.days) || 0;
      
      let iof = 0;
      if (inputs.type === 'exchange') {
        iof = amount * 0.0538; // standard international card IOF recently changing, using 5.38%
      } else {
        const fixed = amount * 0.0038;
        const daily = amount * Math.min(days * 0.000082, 0.015);
        iof = fixed + daily;
      }
      
      return [
        { label: 'IOF Amount', value: iof, type: 'currency', highlight: true },
        { label: 'Effective Rate', value: (iof/amount)*100, type: 'percent' }
      ];
    },
    explanation: 'For loans, IOF consists of a fixed 0.38% plus 0.0082% per day, capped at 1.5% for the daily portion.',
  },
  {
    id: 'capital-gains',
    slug: 'capital-gains',
    title: 'Capital Gains Tax',
    description: 'Calculate income tax on the sale of assets.',
    category: 'taxes',
    icon: 'TrendingUp',
    fields: [
      { id: 'buyPrice', label: 'Purchase Price (R$)', type: 'currency', defaultValue: 300000 },
      { id: 'sellPrice', label: 'Sale Price (R$)', type: 'currency', defaultValue: 450000 },
      { id: 'type', label: 'Asset Type', type: 'select', defaultValue: 'real-estate', options: [{value: 'real-estate', label: 'Real Estate'}, {value: 'stocks', label: 'Stocks (Day Trade)'}, {value: 'stocks-normal', label: 'Stocks (Normal)'}] }
    ],
    calculate: (inputs) => {
      const buy = Number(inputs.buyPrice) || 0;
      const sell = Number(inputs.sellPrice) || 0;
      const profit = Math.max(0, sell - buy);
      
      let taxRate = 0;
      if (inputs.type === 'stocks') taxRate = 0.20;
      else if (inputs.type === 'stocks-normal') taxRate = 0.15;
      else {
        // basic real estate
        if (profit <= 5000000) taxRate = 0.15;
        else if (profit <= 10000000) taxRate = 0.175;
        else if (profit <= 30000000) taxRate = 0.20;
        else taxRate = 0.225;
      }
      
      const tax = profit * taxRate;
      
      return [
        { label: 'Tax Amount (IR)', value: tax, type: 'currency', highlight: true },
        { label: 'Net Profit', value: profit - tax, type: 'currency' },
        { label: 'Gross Profit', value: profit, type: 'currency' }
      ];
    },
    explanation: 'Capital gains are taxed at different rates depending on the asset type and profit size. Exemptions exist (e.g., selling only home to buy another, or stock sales under 20k/month) not covered in this basic estimate.',
  },
  {
    id: 'tax-burden',
    slug: 'tax-burden',
    title: 'Tax Burden (Carga Tributária)',
    description: 'Estimate your total tax burden including consumption taxes.',
    category: 'taxes',
    icon: 'Scale',
    fields: [
      { id: 'salary', label: 'Gross Monthly Income (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'consumption', label: 'Monthly Consumption Spending (R$)', type: 'currency', defaultValue: 3000 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const spend = Number(inputs.consumption) || 0;
      
      // Rough estimate of direct taxes (15%) and indirect/consumption taxes (~35%)
      const direct = salary * 0.15; // INSS+IRPF rough avg
      const indirect = spend * 0.35; // ICMS, IPI, PIS/COFINS rough avg
      
      const totalTaxes = direct + indirect;
      const burden = salary > 0 ? (totalTaxes / salary) * 100 : 0;
      
      return [
        { label: 'Total Tax Burden', value: burden, type: 'percent', highlight: true },
        { label: 'Direct Taxes (est.)', value: direct, type: 'currency' },
        { label: 'Indirect Taxes (est.)', value: indirect, type: 'currency' },
        { label: 'Days worked for taxes', value: Math.round((burden/100)*365), type: 'number' }
      ];
    },
    explanation: 'Brazil has a heavy consumption tax burden. This tool estimates your true tax rate combining income deductions and taxes embedded in products you buy.',
  },
  {
    id: 'mei-taxes',
    slug: 'mei-taxes',
    title: 'MEI Taxes (DAS)',
    description: 'Calculate the monthly DAS payment for MEI (Microempreendedor Individual).',
    category: 'taxes',
    icon: 'Briefcase',
    fields: [
      { id: 'type', label: 'Business Type', type: 'select', defaultValue: 'services', options: [
        {value: 'commerce', label: 'Commerce/Industry (ICMS)'},
        {value: 'services', label: 'Services (ISS)'},
        {value: 'mixed', label: 'Mixed (ICMS + ISS)'}
      ]},
    ],
    calculate: (inputs) => {
      const baseInss = 1412 * 0.05; // 5% of minimum wage
      let total = baseInss;
      if (inputs.type === 'commerce') total += 1;
      if (inputs.type === 'services') total += 5;
      if (inputs.type === 'mixed') total += 6;
      
      return [
        { label: 'Monthly DAS', value: total, type: 'currency', highlight: true },
        { label: 'Annual Total', value: total * 12, type: 'currency' },
        { label: 'INSS Contribution', value: baseInss, type: 'currency' }
      ];
    },
    explanation: 'MEI pays a fixed monthly fee (DAS) representing 5% of the minimum wage for INSS, plus R$1 for ICMS (commerce) and/or R$5 for ISS (services).',
  },
  {
    id: 'simples-nacional',
    slug: 'simples-nacional',
    title: 'Simples Nacional Calculator',
    description: 'Estimate taxes for small businesses under the Simples regime.',
    category: 'taxes',
    icon: 'Calculator',
    fields: [
      { id: 'annualRev', label: 'Annual Revenue (last 12m) (R$)', type: 'currency', defaultValue: 200000 },
      { id: 'monthlyRev', label: 'This Month Revenue (R$)', type: 'currency', defaultValue: 20000 },
      { id: 'anexo', label: 'Activity Type', type: 'select', defaultValue: 'anexo1', options: [
        {value: 'anexo1', label: 'Commerce (Anexo I)'},
        {value: 'anexo3', label: 'Services (Anexo III)'}
      ]},
    ],
    calculate: (inputs) => {
      const rbt12 = Number(inputs.annualRev) || 0;
      const rev = Number(inputs.monthlyRev) || 0;
      
      let rate = 0;
      let deduct = 0;
      
      if (inputs.anexo === 'anexo1') {
        if (rbt12 <= 180000) { rate = 0.04; deduct = 0; }
        else if (rbt12 <= 360000) { rate = 0.073; deduct = 5940; }
        else if (rbt12 <= 720000) { rate = 0.095; deduct = 13860; }
        else { rate = 0.107; deduct = 22500; }
      } else { // anexo3
        if (rbt12 <= 180000) { rate = 0.06; deduct = 0; }
        else if (rbt12 <= 360000) { rate = 0.112; deduct = 9360; }
        else if (rbt12 <= 720000) { rate = 0.135; deduct = 17640; }
        else { rate = 0.16; deduct = 35640; }
      }
      
      let effectiveRate = rbt12 > 0 ? ((rbt12 * rate) - deduct) / rbt12 : rate;
      effectiveRate = Math.max(0, effectiveRate);
      
      const das = rev * effectiveRate;
      
      return [
        { label: 'Estimated DAS Payment', value: das, type: 'currency', highlight: true },
        { label: 'Effective Tax Rate', value: effectiveRate * 100, type: 'percent' },
      ];
    },
    explanation: 'Calculates the effective tax rate using the formula: ((RBT12 * nominal rate) - deduction) / RBT12. Only shows first 4 brackets.',
  }
];
