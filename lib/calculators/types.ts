import type { IconName } from "@/lib/icons";

export interface CalculatorField {
  id: string;
  label: string;
  type: 'number' | 'percent' | 'currency' | 'select' | 'date' | 'boolean';
  placeholder?: string;
  defaultValue?: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export interface CalculatorResult {
  label: string;
  value: number | string;
  type: 'currency' | 'percent' | 'number' | 'text' | 'date';
  highlight?: boolean; // primary result
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export interface CalculatorStep {
  label: string;
  value: string;
}

export interface CalculatorConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CalculatorCategory;
  icon: IconName; // lucide icon name
  fields: CalculatorField[];
  calculate: (inputs: Record<string, any>) => CalculatorResult[];
  formula?: string; // LaTeX-style or plain text
  explanation: string;
  stepByStep?: (inputs: Record<string, any>, results: CalculatorResult[]) => CalculatorStep[];
  example?: {
    inputs: Record<string, number | string | boolean>;
    description: string;
  };
  notes?: string[];
  relatedTools?: string[]; // slugs
  faq?: { question: string; answer: string }[];
}

export type CalculatorCategory = 
  | 'investments' 
  | 'loans' 
  | 'credit-cards' 
  | 'retirement' 
  | 'taxes' 
  | 'salary' 
  | 'real-estate' 
  | 'business' 
  | 'general';
