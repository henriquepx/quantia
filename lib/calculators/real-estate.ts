import { CalculatorConfig } from './types';
import { pmt } from './utils';

export const realEstateCalculators: CalculatorConfig[] = [
  {
    id: 'rent-vs-buy',
    slug: 'rent-vs-buy',
    title: 'Rent vs. Buy',
    description: 'Compare the financial impact of renting vs buying a home over time.',
    category: 'real-estate',
    icon: 'Home',
    fields: [
      { id: 'propertyValue', label: 'Property Value (R$)', type: 'currency', defaultValue: 500000 },
      { id: 'downPayment', label: 'Down Payment (R$)', type: 'currency', defaultValue: 100000 },
      { id: 'mortgageRate', label: 'Mortgage Rate (% a.a.)', type: 'percent', defaultValue: 9.5 },
      { id: 'rent', label: 'Monthly Rent (R$)', type: 'currency', defaultValue: 2500 },
      { id: 'years', label: 'Period (Years)', type: 'number', defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const pv = Number(inputs.propertyValue) || 0;
      const down = Number(inputs.downPayment) || 0;
      const rate = (Number(inputs.mortgageRate) || 0) / 100;
      const rent = Number(inputs.rent) || 0;
      const years = Number(inputs.years) || 0;
      const months = years * 12;
      
      const loan = pv - down;
      const monthlyMortgage = pmt(rate/12, months, loan);
      const totalBuyPaid = down + (monthlyMortgage * months);
      
      const totalRentPaid = rent * months;
      
      return [
        { label: 'Total Paid if Buying', value: totalBuyPaid, type: 'currency' },
        { label: 'Total Paid if Renting', value: totalRentPaid, type: 'currency' },
        { label: 'Monthly Mortgage', value: monthlyMortgage, type: 'currency' },
      ];
    },
    explanation: 'A basic comparison. In reality, consider property appreciation, rent inflation, and opportunity cost of investing the down payment.',
  }
];
