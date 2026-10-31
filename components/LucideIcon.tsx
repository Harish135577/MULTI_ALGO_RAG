import { icons } from 'lucide-react';

export const LucideIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};
export default LucideIcon;
