import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface DependengaLogoProps {
  href?: string;
  className?: string;
  as?: "h1" | "div";
}

export function DependengaLogo({ href, className, as = "div" }: DependengaLogoProps) {
  if (href) {
    return (
      <Link href={href} className={cn("v2-logo v2-logo-pressable", className)}>
        Dependenga
      </Link>
    );
  }

  const Tag = as;
  return (
    <Tag className={cn("v2-logo v2-logo-pressable", className)}>
      Dependenga
    </Tag>
  );
}
