import { CalculatorConfig } from './types';
import { pmt, fv } from './utils';

export const retirementCalculators: CalculatorConfig[] = [
  {
    id: 'retirement',
    slug: 'retirement',
    title: 'Retirement Planner',
    description: 'Calculate how much you will have when you retire.',
    category: 'retirement',
    icon: 'Palmtree',
    fields: [
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30 },
      { id: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: 65 },
      { id: 'currentSavings', label: 'Current Savings (R$)', type: 'currency', defaultValue: 50000 },
      { id: 'monthly', label: 'Monthly Contribution (R$)', type: 'currency', defaultValue: 1000 },
      { id: 'rate', label: 'Expected Real Return (% a.a.)', type: 'percent', defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const currentAge = Number(inputs.currentAge) || 0;
      const retirementAge = Number(inputs.retirementAge) || 0;
      const years = Math.max(0, retirementAge - currentAge);
      const months = years * 12;
      
      const currentSavings = Number(inputs.currentSavings) || 0;
      const monthly = Number(inputs.monthly) || 0;
      const rate = (Number(inputs.rate) || 0) / 100;
      
      const monthlyRate = Math.pow(1 + rate, 1/12) - 1;
      
      const futureSavings = currentSavings * Math.pow(1 + monthlyRate, months);
      const futureContributions = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      
      const total = futureSavings + futureContributions;
      const safeWithdrawal = total * 0.04 / 12; // 4% rule
      
      return [
        { label: 'Retirement Portfolio', value: total, type: 'currency', highlight: true },
        { label: 'Monthly Income (4% Rule)', value: safeWithdrawal, type: 'currency' },
        { label: 'Years to Save', value: years, type: 'number' },
      ];
    },
    explanation: 'Uses real returns (return minus inflation) to estimate purchasing power at retirement. The 4% rule is a common rule of thumb for safe withdrawal rates.',
  },
  {
    id: 'fire-number',
    slug: 'fire-number',
    title: 'FIRE Number',
    description: 'Calculate the total portfolio needed for Financial Independence, Retire Early.',
    category: 'retirement',
    icon: 'Flame',
    fields: [
      { id: 'expenses', label: 'Monthly Expenses (R$)', type: 'currency', defaultValue: 10000 },
      { id: 'withdrawalRate', label: 'Safe Withdrawal Rate (%)', type: 'percent', defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const expenses = Number(inputs.expenses) || 0;
      const annualExpenses = expenses * 12;
      const swr = (Number(inputs.withdrawalRate) || 0) / 100;
      
      const fireNumber = swr > 0 ? annualExpenses / swr : 0;
      
      return [
        { label: 'Target FIRE Number', value: fireNumber, type: 'currency', highlight: true },
        { label: 'Lean FIRE (0.8x)', value: fireNumber * 0.8, type: 'currency' },
        { label: 'Fat FIRE (1.5x)', value: fireNumber * 1.5, type: 'currency' },
      ];
    },
    explanation: 'The FIRE number is calculated by dividing your annual expenses by your safe withdrawal rate. A 4% rate means you need 25x your annual expenses.',
  }
  ,{
    id: 'financial-independence', slug: 'financial-independence', title: 'Financial Independence Planner', description: 'Estimate when your investments can cover your lifestyle without active income.', category: 'retirement', icon: 'Flame',
    fields: [
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30 },
      { id: 'currentPortfolio', label: 'Current Portfolio (R$)', type: 'currency', defaultValue: 50000 },
      { id: 'monthlyExpenses', label: 'Monthly Expenses (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'monthlyContribution', label: 'Monthly Investment (R$)', type: 'currency', defaultValue: 2000 },
      { id: 'realReturn', label: 'Expected Real Return (% a.a.)', type: 'percent', defaultValue: 5 },
      { id: 'withdrawalRate', label: 'Safe Withdrawal Rate (%)', type: 'percent', defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const age=Math.max(0,Number(inputs.currentAge)||0), portfolio=Math.max(0,Number(inputs.currentPortfolio)||0), expenses=Math.max(0,Number(inputs.monthlyExpenses)||0), contribution=Math.max(0,Number(inputs.monthlyContribution)||0), annualRate=Math.max(0,Number(inputs.realReturn)||0)/100, withdrawal=Math.max(0.1,Number(inputs.withdrawalRate)||4)/100;
      const target=expenses*12/withdrawal, monthlyRate=Math.pow(1+annualRate,1/12)-1; let balance=portfolio, months=0; const maxMonths=120*12;
      while(balance<target && months<maxMonths){ balance=balance*(1+monthlyRate)+contribution; months++; if(monthlyRate===0 && contribution===0) break; }
      const reachable=balance>=target, years=reachable?months/12:120, passiveMonthly=target*withdrawal/12;
      return [
        {label:'Financial Independence Target',value:target,type:'currency',highlight:true},
        {label:'Estimated Time',value:years,type:'number'},
        {label:'Estimated Age',value:age+years,type:'number'},
        {label:'Monthly Passive Income',value:passiveMonthly,type:'currency'},
      ];
    },
    formula: 'FIRE target = annual expenses / withdrawal rate',
    explanation: 'Projects your portfolio month by month using your current investments, monthly contributions and expected real return. Independence is reached when the portfolio can support your annual expenses at the selected safe withdrawal rate.',
  }
];
