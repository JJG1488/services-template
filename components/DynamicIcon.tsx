import { Wrench } from "lucide-react";
import * as Icons from "lucide-react";

interface DynamicIconProps {
  name: string | null | undefined;
  className?: string;
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
  if (!name) {
    return <Wrench className={className} />;
  }

  // Convert kebab-case to PascalCase for icon lookup
  const iconName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[iconName];

  if (!IconComponent) {
    return <Wrench className={className} />;
  }

  return <IconComponent className={className} />;
}
