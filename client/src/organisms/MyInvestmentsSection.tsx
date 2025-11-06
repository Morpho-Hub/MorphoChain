import Card from '../atoms/Card';
import Button from '../atoms/button';
import { Typography } from '../atoms/Typography';
import { InvestmentCard, InvestmentData } from '../organisms/InvestmentCard';

interface MyInvestmentsSectionProps {
  investments: InvestmentData[];
  className?: string;
}

export const MyInvestmentsSection = ({
  investments,
  className = ''
}: MyInvestmentsSectionProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h3">Mis Inversiones</Typography>
        <Button
          title = 'Agregar Más'
          variant="white_bordered"
          className="border-black text-black hover:bg-black"
        >
        </Button>
      </div>

      <div className="space-y-4">
        {investments.map((investment) => (
          <InvestmentCard
            key={investment.id}
            investment={investment}
          />
        ))}
      </div>
    </Card>
  );
};