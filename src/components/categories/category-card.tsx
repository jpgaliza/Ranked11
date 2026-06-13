import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryManifestEntry } from "@/types/category";
import {
  Trophy,
  Shield,
  Medal,
  Target,
  ShieldOff,
  Calendar,
  Star,
  Award,
  XCircle,
  Lock,
  Flame,
  Users,
  Zap,
  Globe,
  Handshake,
  AlertTriangle,
  Clipboard,
  CheckCircle,
  MapPin,
  Landmark,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  shield: Shield,
  medal: Medal,
  target: Target,
  "shield-off": ShieldOff,
  calendar: Calendar,
  star: Star,
  award: Award,
  "x-circle": XCircle,
  lock: Lock,
  flame: Flame,
  users: Users,
  zap: Zap,
  globe: Globe,
  handshake: Handshake,
  "alert-triangle": AlertTriangle,
  clipboard: Clipboard,
  "check-circle": CheckCircle,
  "map-pin": MapPin,
  stadium: Landmark,
};

interface CategoryCardProps {
  entry: CategoryManifestEntry;
}

export async function CategoryCard({ entry }: CategoryCardProps) {
  const t = await getTranslations();
  const title = t(`${entry.i18nKey}.title`);
  const description = t(`${entry.i18nKey}.description`);

  const IconComponent = iconMap[entry.icon] ?? Trophy;

  return (
    <Link href={`/categories/${entry.id}`} className="group block">
      <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-primary">
        <CardHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconComponent className="h-5 w-5" aria-hidden />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
