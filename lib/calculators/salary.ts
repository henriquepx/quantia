import { CalculatorConfig } from './types';

export const salaryCalculators: CalculatorConfig[] = [
  {
    id: 'net-salary',
    slug: 'net-salary',
    title: 'Net Salary Calculator (CLT)',
    description: 'Calculate net salary by deducting INSS and IRPF.',
    category: 'salary',
    icon: 'Banknote',
    fields: [
      { id: 'salary', label: 'Gross Salary (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'dependents', label: 'Dependents', type: 'number', defaultValue: 0 },
      { id: 'otherDeductions', label: 'Other Deductions (R$)', type: 'currency', defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const deps = Number(inputs.dependents) || 0;
      const others = Number(inputs.otherDeductions) || 0;
      
      let inss = 0;
      if (salary <= 1412) inss = salary * 0.075;
      else if (salary <= 2666.68) inss = 105.9 + (salary - 1412) * 0.09;
      else if (salary <= 4000.03) inss = 105.9 + 112.92 + (salary - 2666.68) * 0.12;
      else if (salary <= 7786.02) inss = 105.9 + 112.92 + 160.00 + (salary - 4000.03) * 0.14;
      else inss = 908.85; 
      
      const baseIr = salary - inss - (deps * 189.59);
      
      let ir = 0;
      if (baseIr <= 2259.20) ir = 0;
      else if (baseIr <= 2826.65) ir = (baseIr * 0.075) - 169.44;
      else if (baseIr <= 3751.05) ir = (baseIr * 0.15) - 381.44;
      else if (baseIr <= 4664.68) ir = (baseIr * 0.225) - 662.77;
      else ir = (baseIr * 0.275) - 896.00;
      ir = Math.max(0, ir);
      
      const net = salary - inss - ir - others;
      
      return [
        { label: 'Net Salary', value: net, type: 'currency', highlight: true },
        { label: 'INSS', value: inss, type: 'currency' },
        { label: 'IRRF', value: ir, type: 'currency' },
        { label: 'Total Deductions', value: inss + ir + others, type: 'currency' },
      ];
    },
    explanation: 'Calculates the CLT net salary using 2024 INSS and IRPF progressive brackets.',
  },
  {
    id: 'thirteenth-salary',
    slug: 'thirteenth-salary',
    title: '13th Salary Calculator',
    description: 'Calculate your proportional 13th salary.',
    category: 'salary',
    icon: 'Gift',
    fields: [
      { id: 'salary', label: 'Gross Salary (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'months', label: 'Months Worked This Year', type: 'number', defaultValue: 12, max: 12 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const months = Math.min(12, Math.max(1, Number(inputs.months) || 12));
      
      const gross13 = (salary / 12) * months;
      const firstInstallment = gross13 / 2;
      
      const inss = gross13 * 0.10; 
      const ir = gross13 > 2259 ? gross13 * 0.075 : 0; 
      const secondInstallment = gross13 - firstInstallment - inss - ir;
      
      return [
        { label: 'Total Net 13th', value: firstInstallment + secondInstallment, type: 'currency', highlight: true },
        { label: '1st Installment (Nov)', value: firstInstallment, type: 'currency' },
        { label: '2nd Installment (Dec)', value: secondInstallment, type: 'currency' },
      ];
    },
    explanation: 'The 13th salary is paid in two parts. The first is paid by Nov 30 with no deductions. The second is paid by Dec 20, minus all INSS and IR deductions for the full value.',
  },
  {
    id: 'vacation',
    slug: 'vacation',
    title: 'Vacation Pay (Férias)',
    description: 'Calculate your vacation payment plus the 1/3 constitutional bonus.',
    category: 'salary',
    icon: 'Sun',
    fields: [
      { id: 'salary', label: 'Monthly Salary (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'days', label: 'Vacation Days', type: 'number', defaultValue: 30, max: 30 },
      { id: 'sell', label: 'Sell Days (Abono Pecuniário)', type: 'number', defaultValue: 0, max: 10 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const days = Number(inputs.days) || 30;
      const sell = Number(inputs.sell) || 0;
      
      const daily = salary / 30;
      const takenDaysValue = daily * days;
      const oneThirdTaken = takenDaysValue / 3;
      
      const soldDaysValue = daily * sell;
      const oneThirdSold = soldDaysValue / 3;
      
      const grossVacation = takenDaysValue + oneThirdTaken;
      const grossSold = soldDaysValue + oneThirdSold;
      
      const inss = grossVacation * 0.1;
      const ir = grossVacation * 0.075;
      
      const net = grossVacation - inss - ir + grossSold;
      
      return [
        { label: 'Total Net Receivable', value: net, type: 'currency', highlight: true },
        { label: 'Vacation + 1/3', value: grossVacation, type: 'currency' },
        { label: 'Sold Days + 1/3 (Tax Free)', value: grossSold, type: 'currency' },
      ];
    },
    explanation: 'Vacation pay includes your salary for the days taken plus a 1/3 bonus. You can sell up to 1/3 of your vacation days tax-free.',
  },
  {
    id: 'hourly-wage',
    slug: 'hourly-wage',
    title: 'Hourly Wage Calculator',
    description: 'Convert your monthly salary into an hourly or daily rate.',
    category: 'salary',
    icon: 'Clock',
    fields: [
      { id: 'salary', label: 'Monthly Salary (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'hoursWeek', label: 'Hours per Week', type: 'number', defaultValue: 44 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const hw = Number(inputs.hoursWeek) || 44;
      
      const divisor = (hw / 6) * 30; 
      const hourly = salary / divisor;
      const daily = hourly * (hw / 5);
      
      return [
        { label: 'Hourly Rate', value: hourly, type: 'currency', highlight: true },
        { label: 'Daily Rate (est)', value: daily, type: 'currency' },
        { label: 'Monthly Hours Factor', value: divisor, type: 'number' },
      ];
    },
    explanation: 'For a 44-hour work week, the standard divisor to find the hourly rate is 220 hours per month.',
  },
  {
    id: 'overtime',
    slug: 'overtime',
    title: 'Overtime Calculator (Hora Extra)',
    description: 'Calculate how much you earn for working overtime.',
    category: 'salary',
    icon: 'Timer',
    fields: [
      { id: 'salary', label: 'Monthly Salary (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'hoursWeek', label: 'Hours per Week', type: 'number', defaultValue: 44 },
      { id: 'normalOvertime', label: 'Overtime 50% (hours)', type: 'number', defaultValue: 10 },
      { id: 'sundayOvertime', label: 'Overtime 100% (hours)', type: 'number', defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const hw = Number(inputs.hoursWeek) || 44;
      const ot50 = Number(inputs.normalOvertime) || 0;
      const ot100 = Number(inputs.sundayOvertime) || 0;
      
      const divisor = (hw / 6) * 30; 
      const hourly = salary / divisor;
      
      const val50 = hourly * 1.5 * ot50;
      const val100 = hourly * 2.0 * ot100;
      
      const dsr = (val50 + val100) / 6;
      
      return [
        { label: 'Total Overtime Pay', value: val50 + val100 + dsr, type: 'currency', highlight: true },
        { label: '50% Hours Value', value: val50, type: 'currency' },
        { label: '100% Hours Value', value: val100, type: 'currency' },
        { label: 'DSR Impact', value: dsr, type: 'currency' },
      ];
    },
    explanation: 'Overtime adds 50% on normal days and 100% on Sundays/Holidays. It also positively impacts your paid weekly rest (DSR).',
  },
  {
    id: 'fgts',
    slug: 'fgts',
    title: 'FGTS Calculator',
    description: 'Estimate your FGTS balance and severance fine.',
    category: 'salary',
    icon: 'PiggyBank',
    fields: [
      { id: 'salary', label: 'Current Salary (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'months', label: 'Months Worked', type: 'number', defaultValue: 36 },
      { id: 'type', label: 'Dismissal Type', type: 'select', defaultValue: 'unfair', options: [{value: 'unfair', label: 'Unfair Dismissal (40% fine)'}, {value: 'resign', label: 'Resignation (no fine)'}] }
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const months = Number(inputs.months) || 0;
      
      const monthlyDeposit = salary * 0.08;
      const estimatedBalance = monthlyDeposit * months;
      
      let fine = 0;
      if (inputs.type === 'unfair') {
        fine = estimatedBalance * 0.40;
      }
      
      return [
        { label: 'Total Available', value: estimatedBalance + fine, type: 'currency', highlight: true },
        { label: 'Estimated Balance', value: estimatedBalance, type: 'currency' },
        { label: '40% Fine', value: fine, type: 'currency' },
      ];
    },
    explanation: 'Employers deposit 8% of your salary into FGTS. If fired without cause, you receive a 40% fine on the total balance deposited by that employer.',
  },
  {
    id: 'employer-cost',
    slug: 'employer-cost',
    title: 'Employer Cost (CLT)',
    description: 'Calculate the true cost of an employee to a company.',
    category: 'salary',
    icon: 'Building',
    fields: [
      { id: 'salary', label: 'Gross Salary (R$)', type: 'currency', defaultValue: 5000 },
      { id: 'vr', label: 'Benefits (Meal, Transit) (R$)', type: 'currency', defaultValue: 800 },
      { id: 'simples', label: 'Is Simples Nacional?', type: 'select', defaultValue: 'no', options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No (Lucro Real/Presumido)'}] }
    ],
    calculate: (inputs) => {
      const salary = Number(inputs.salary) || 0;
      const benefits = Number(inputs.vr) || 0;
      const isSimples = inputs.simples === 'yes';
      
     
      const provisions = salary * 0.33; 
      
      let encargo = 0;
      if (!isSimples) {
        encargo = salary * 0.278; 
      }
      
      const totalCost = salary + benefits + provisions + encargo;
      
      return [
        { label: 'Total Monthly Cost', value: totalCost, type: 'currency', highlight: true },
        { label: 'Cost Multiplier', value: totalCost / salary, type: 'number' },
        { label: 'Taxes & Provisions', value: provisions + encargo, type: 'currency' },
      ];
    },
    explanation: 'A CLT employee usually costs the company 1.5x to 1.8x their gross salary due to provisions for vacation, 13th salary, FGTS, and employer INSS.',
  }
];
