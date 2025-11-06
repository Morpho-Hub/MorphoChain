interface AchievementBadgeProps {
  title: string;
  description: string;
  className?: string;
}

export const AchievementBadge = ({ title, description, className = '' }: AchievementBadgeProps) => {
  return (
    <div className={`p-4 rounded-xl bg-black text-white text-center ${className}`}>
      <p className="text-sm mb-1">{title}</p>
      <p className="text-xs opacity-80">{description}</p>
    </div>
  );
};