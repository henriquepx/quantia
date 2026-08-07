import { CalculatorConfig } from './types';

export const generalCalculators: CalculatorConfig[] = [
  {
    id: 'percentage',
    slug: 'percentage',
    title: 'Percentage Calculator',
    description: 'Simple tool to calculate percentages.',
    category: 'general',
    icon: 'Percent',
    fields: [
      { id: 'x', label: 'What is X %', type: 'number', defaultValue: 15 },
      { id: 'y', label: 'of Y ?', type: 'number', defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const x = Number(inputs.x) || 0;
      const y = Number(inputs.y) || 0;
      
      return [
        { label: 'Result', value: (x / 100) * y, type: 'number', highlight: true },
      ];
    },
    explanation: 'Basic percentage calculation.',
  },
  {
    id: 'percentage-change',
    slug: 'percentage-change',
    title: 'Percentage Change',
    description: 'Calculate the percentage increase or decrease between two values.',
    category: 'general',
    icon: 'TrendingUp',
    fields: [
      { id: 'old', label: 'Original Value', type: 'number', defaultValue: 100 },
      { id: 'new', label: 'New Value', type: 'number', defaultValue: 120 },
    ],
    calculate: (inputs) => {
      const oldVal = Number(inputs.old) || 0;
      const newVal = Number(inputs.new) || 0;
      
      if (oldVal === 0) return [{ label: 'Percentage Change', value: 0, type: 'percent', highlight: true }];
      
      const change = ((newVal - oldVal) / Math.abs(oldVal)) * 100;
      
      return [
        { label: 'Percentage Change', value: change, type: 'percent', highlight: true },
        { label: 'Absolute Difference', value: Math.abs(newVal - oldVal), type: 'number' },
      ];
    },
    explanation: 'Useful for finding out how much a price or value grew or shrank relative to its starting point.',
  },
  {
    id: 'rule-of-three',
    slug: 'rule-of-three',
    title: 'Rule of Three (Regra de Três)',
    description: 'Solve proportions: if A = B, then C = X.',
    category: 'general',
    icon: 'Divide',
    fields: [
      { id: 'a', label: 'Value A', type: 'number', defaultValue: 10 },
      { id: 'b', label: 'equals B', type: 'number', defaultValue: 50 },
      { id: 'c', label: 'Then C', type: 'number', defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const a = Number(inputs.a) || 1;
      const b = Number(inputs.b) || 0;
      const c = Number(inputs.c) || 0;
      
      const x = (b * c) / a;
      
      return [
        { label: 'X equals', value: x, type: 'number', highlight: true },
      ];
    },
    explanation: 'Cross-multiplies to find the unknown value in a direct proportion.',
  },
  {
    id: 'inflation-adjustment',
    slug: 'inflation-adjustment',
    title: 'Inflation Adjustment',
    description: 'Adjust a past value to today using a total inflation rate.',
    category: 'general',
    icon: 'TrendingUp',
    fields: [
      { id: 'amount', label: 'Original Amount (R$)', type: 'currency', defaultValue: 1000 },
      { id: 'inflation', label: 'Total Inflation in period (%)', type: 'percent', defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const amount = Number(inputs.amount) || 0;
      const inf = (Number(inputs.inflation) || 0) / 100;
      
      const adjusted = amount * (1 + inf);
      
      return [
        { label: 'Adjusted Amount', value: adjusted, type: 'currency', highlight: true },
        { label: 'Purchasing Power Loss', value: amount - (amount / (1+inf)), type: 'currency' },
      ];
    },
    explanation: 'Adjusts an old monetary value to reflect accumulated inflation over time.',
  },
  {
    id: 'budget-planner',
    slug: 'budget-planner',
    title: '50/30/20 Budget Planner',
    description: 'Split your net income into Needs, Wants, and Savings.',
    category: 'general',
    icon: 'PieChart',
    fields: [
      { id: 'income', label: 'Net Monthly Income (R$)', type: 'currency', defaultValue: 5000 },
    ],
    calculate: (inputs) => {
      const inc = Number(inputs.income) || 0;
      
      return [
        { label: 'Needs (50%)', value: inc * 0.5, type: 'currency', highlight: true },
        { label: 'Wants (30%)', value: inc * 0.3, type: 'currency' },
        { label: 'Savings/Investing (20%)', value: inc * 0.2, type: 'currency' },
      ];
    },
    explanation: 'The 50/30/20 rule is a simple budgeting framework to ensure you cover essentials while still enjoying life and saving for the future.',
  }
];
