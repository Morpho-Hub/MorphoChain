import { Typography } from '../atoms/Typography';
import Badge from '../atoms/Badge';
import { Icon } from '../atoms/Icon';

interface InvestmentHeaderProps {
  name: string;
  location: string;
  isVerified?: boolean;
}

export const InvestmentHeader = ({ name, location, isVerified = true }: InvestmentHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d1e751] to-green-400 flex items-center justify-center flex-shrink-0">
          <Icon name="leaf" size="lg" className="text-black" />
        </div>
        <div>
          <Typography variant="h4" className="mb-1">{name}</Typography>
          <Typography variant="caption">{location}</Typography>
        </div>
      </div>
      {isVerified && <Badge variant="primary">Verificado</Badge>}
    </div>
  );
};