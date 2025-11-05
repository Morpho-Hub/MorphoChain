import { InvestmentItem } from "../atoms/InvestmentItem";

interface Investment {
  image: string;
  name: string;
  location: string;
  invested: string;
  progress: number;
  roi: string;
}

interface InvestmentListProps {
  investments: Investment[];
}

export function InvestmentList({ investments }: InvestmentListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {investments.map((item, index) => (
        <InvestmentItem
          key={index}
          image={item.image}
          name={item.name}
          location={item.location}
          invested={item.invested}
          progress={item.progress}
          roi={item.roi}
        />
      ))}
    </div>
  );
}
