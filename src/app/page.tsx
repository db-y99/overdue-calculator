import { OverdueCalculator } from '@/components/overdue-calculator';

export default function Home() {
  return (
    <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
      <OverdueCalculator />
    </main>
  );
}
