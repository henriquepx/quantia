import { CalculatorConfig } from './types';

export const businessCalculators: CalculatorConfig[] = [
  {
    id: 'break-even',
    slug: 'break-even',
    title: 'Break-Even Point',
    description: 'Calculate how many units you need to sell to cover all costs.',
    category: 'business',
    icon: 'Building2',
    fields: [
      { id: 'fixedCosts', label: 'Fixed Costs (R$/month)', type: 'currency', defaultValue: 5000 },
      { id: 'variableCost', label: 'Variable Cost per Unit (R$)', type: 'currency', defaultValue: 20 },
      { id: 'price', label: 'Sale Price per Unit (R$)', type: 'currency', defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const fc = Number(inputs.fixedCosts) || 0;
      const vc = Number(inputs.variableCost) || 0;
      const p = Number(inputs.price) || 0;
      
      const contributionMargin = p - vc;
      const breakEvenUnits = contributionMargin > 0 ? fc / contributionMargin : 0;
      const breakEvenRevenue = breakEvenUnits * p;
      
      return [
        { label: 'Units to Break Even', value: Math.ceil(breakEvenUnits), type: 'number', highlight: true },
        { label: 'Revenue to Break Even', value: breakEvenRevenue, type: 'currency' },
        { label: 'Contribution Margin', value: contributionMargin, type: 'currency' },
      ];
    },
    explanation: 'The break-even point is when total revenue equals total costs. Any units sold past this point contribute directly to profit.',
  },
  {
    id: 'markup',
    slug: 'markup',
    title: 'Markup & Pricing',
    description: 'Calculate the right sale price based on costs and desired margin.',
    category: 'business',
    icon: 'Tags',
    fields: [
      { id: 'cost', label: 'Product Cost (R$)', type: 'currency', defaultValue: 100 },
      { id: 'margin', label: 'Desired Profit Margin (%)', type: 'percent', defaultValue: 20 },
      { id: 'taxes', label: 'Taxes on Sale (%)', type: 'percent', defaultValue: 10 },
      { id: 'commissions', label: 'Commissions (%)', type: 'percent', defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const margin = (Number(inputs.margin) || 0) / 100;
      const taxes = (Number(inputs.taxes) || 0) / 100;
      const comm = (Number(inputs.commissions) || 0) / 100;
      
      const totalVariable = margin + taxes + comm;
      let price = 0;
      
      if (totalVariable < 1) {
        price = cost / (1 - totalVariable);
      }
      
      const markupPercent = cost > 0 ? ((price - cost) / cost) * 100 : 0;
      
      return [
        { label: 'Suggested Sale Price', value: price, type: 'currency', highlight: true },
        { label: 'Markup Rate', value: markupPercent, type: 'percent' },
        { label: 'Gross Profit', value: price * margin, type: 'currency' },
      ];
    },
    explanation: 'Calculates the price required to achieve a target profit margin while covering variable taxes and commissions.',
  }
];
