import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  bgColor = "bg-blue-50",
  iconColor = "text-blue-600",
  trend,
  trendValue,
}) => {
  return (
    <div
      className={`${bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatsCard;
