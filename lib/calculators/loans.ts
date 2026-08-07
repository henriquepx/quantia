import { CalculatorConfig } from './types';
import { pmt } from './utils';

export const loansCalculators: CalculatorConfig[] = [
  {
    id: 'loan',
    slug: 'loan',
    title: 'Personal Loan Calculator',
    description: 'Calculate monthly payments for a personal loan.',
    category: 'loans',
    icon: 'Banknote',
    fields: [
      { id: 'amount', label: 'Loan Amount (R$)', type: 'currency', defaultValue: 10000 },
      { id: 'rate', label: 'Monthly Interest Rate (%)', type: 'percent', defaultValue: 2 },
      { id: 'months', label: 'Term (Months)', type: 'number', defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.amount) || 0;
      const rate = (Number(inputs.rate) || 0) / 100;
      const months = Number(inputs.months) || 0;
      
      const monthlyPayment = pmt(rate, months, amount);
      const totalPaid = monthlyPayment * months;
      
      return [
        { label: 'Monthly Payment', value: monthlyPayment, type: 'currency', highlight: true },
        { label: 'Total Paid', value: totalPaid, type: 'currency' },
        { label: 'Total Interest', value: totalPaid - amount, type: 'currency' },
      ];
    },
    explanation: 'Uses the Price Table (Tabela Price) formula to calculate fixed monthly payments.',
  },
  {
    id: 'sac-financing',
    slug: 'sac-financing',
    title: 'SAC Amortization',
    description: 'Calculate decreasing installments using the Constant Amortization System.',
    category: 'loans',
    icon: 'TrendingDown',
    fields: [
      { id: 'amount', label: 'Loan Amount (R$)', type: 'currency', defaultValue: 100000 },
      { id: 'rate', label: 'Monthly Interest Rate (%)', type: 'percent', defaultValue: 1 },
      { id: 'months', label: 'Term (Months)', type: 'number', defaultValue: 120 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.amount) || 0;
      const rate = (Number(inputs.rate) || 0) / 100;
      const months = Number(inputs.months) || 1;
      
      const amortization = amount / months;
      const firstInterest = amount * rate;
      const firstPayment = amortization + firstInterest;
      
      const lastInterest = amortization * rate;
      const lastPayment = amortization + lastInterest;
      
      const totalInterest = (firstInterest + lastInterest) * months / 2;
      const totalPaid = amount + totalInterest;
      
      return [
        { label: 'First Payment', value: firstPayment, type: 'currency', highlight: true },
        { label: 'Last Payment', value: lastPayment, type: 'currency' },
        { label: 'Total Interest', value: totalInterest, type: 'currency' },
        { label: 'Total Paid', value: totalPaid, type: 'currency' },
      ];
    },
    explanation: 'In the SAC system, the principal is paid down in equal parts, so the interest—and therefore the total monthly payment—decreases over time.',
  }
];
