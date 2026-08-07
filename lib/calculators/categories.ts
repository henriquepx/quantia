import { CalculatorCategory } from './types';

export interface CategoryInfo {
  id: CalculatorCategory;
  label: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'investments', label: 'Investments', icon: 'TrendingUp', description: 'Compound interest, ROI, Tesouro Direto & savings.' },
  { id: 'loans', label: 'Loans', icon: 'Landmark', description: 'Mortgages, personal loans, and amortization.' },
  { id: 'credit-cards', label: 'Credit Cards', icon: 'CreditCard', description: 'Interest, cashback, and payoff calculators.' },
  { id: 'retirement', label: 'Retirement', icon: 'Palmtree', description: 'FIRE number, INSS, and long-term planning.' },
  { id: 'taxes', label: 'Taxes', icon: 'Receipt', description: 'IRPF, IOF, capital gains, and corporate taxes.' },
  { id: 'salary', label: 'Salary', icon: 'Banknote', description: 'Net salary, 13th, vacation, and FGTS.' },
  { id: 'real-estate', label: 'Real Estate', icon: 'Home', description: 'Rent vs buy, rental yield, and appreciation.' },
  { id: 'business', label: 'Business', icon: 'Building2', description: 'Break-even, margins, markup, and cash flow.' },
  { id: 'general', label: 'General', icon: 'Calculator', description: 'Percentages, dates, currencies, and budgets.' },
];
