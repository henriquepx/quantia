import { CalculatorConfig } from './types';
import { investmentsCalculators } from './investments';
import { loansCalculators } from './loans';
import { creditCardsCalculators } from './credit-cards';
import { retirementCalculators } from './retirement';
import { taxesCalculators } from './taxes';
import { salaryCalculators } from './salary';
import { realEstateCalculators } from './real-estate';
import { businessCalculators } from './business';
import { generalCalculators } from './general';

export const allCalculators: CalculatorConfig[] = [
  ...investmentsCalculators,
  ...loansCalculators,
  ...creditCardsCalculators,
  ...retirementCalculators,
  ...taxesCalculators,
  ...salaryCalculators,
  ...realEstateCalculators,
  ...businessCalculators,
  ...generalCalculators,
];

export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return allCalculators.find(c => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorConfig[] {
  if (category === 'all') return allCalculators;
  return allCalculators.filter(c => c.category === category);
}

export function searchCalculators(query: string): CalculatorConfig[] {
  const q = query.toLowerCase();
  return allCalculators.filter(c => 
    c.title.toLowerCase().includes(q) || 
    c.description.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  );
}
