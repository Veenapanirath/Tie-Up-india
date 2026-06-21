
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function AnalyticsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: AnalyticsCardProps) {
  return (
    <Card className={cn(
      "bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        {description && (
          <p className={cn(
            "text-sm",
            trend === "up" && "text-green-600",
            trend === "down" && "text-red-600",
            trend === "neutral" && "text-gray-500"
          )}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
