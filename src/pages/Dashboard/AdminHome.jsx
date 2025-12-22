import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Users, BookOpen, Flag, TrendingUp, UserPlus } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import StatsCard from "../../components/ui/StatsCard";
import Loading from "../../components/ui/Loading";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["all-users-chart"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["all-lessons-chart"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/lessons");
      return res.data;
    },
  });

  // Process data for charts (Last 7 days)
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      // Count users created on this day
      const dailyUsers = users.filter((user) => {
        if (!user.createdAt) return false;
        return (
          new Date(user.createdAt).toISOString().split("T")[0] === dateString
        );
      }).length;

      // Count lessons created on this day
      const dailyLessons = lessons.filter((lesson) => {
        if (!lesson.createdAt) return false;
        return (
          new Date(lesson.createdAt).toISOString().split("T")[0] === dateString
        );
      }).length;

      data.push({
        name: dayName,
        users: dailyUsers,
        lessons: dailyLessons,
      });
    }
    return data;
  }, [users, lessons]);

  if (statsLoading || usersLoading || lessonsLoading) return <Loading />;

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Admin Dashboard | Digital Life Lessons</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-semibold">
          Today's Summary
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Total Lessons (All)"
          value={stats?.totalLessons || 0}
          icon={BookOpen}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Reported Lessons"
          value={stats?.reportedLessons || 0}
          icon={Flag}
          bgColor="bg-red-50"
          iconColor="text-red-600"
        />
        <StatsCard
          title="Today's New Lessons"
          value={stats?.todayLessons || 0}
          icon={BookOpen}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartWidget
          title="User Growth (Last 7 Days)"
          icon={TrendingUp}
          iconColor="text-primary-600"
          data={chartData}
          dataKey="users"
          color="#0ea5e9"
          gradientId="colorUsers"
        />
        <ChartWidget
          title="Lesson Growth (Last 7 Days)"
          icon={BookOpen}
          iconColor="text-secondary-600"
          data={chartData}
          dataKey="lessons"
          color="#d946ef"
          gradientId="colorLessons"
        />
      </div>
    </div>
  );
};

// Helper Component for Fixed Y-Axis Chart
const ChartWidget = ({
  title,
  icon: Icon,
  iconColor,
  data,
  dataKey,
  color,
  gradientId,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        {title}
      </h3>
      <div className="flex h-80">
        {/* Fixed Y-Axis Container */}
        <div className="w-12 h-full flex-shrink-0 -mr-2 z-10 bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              {/* Invisible Area to establish Scale */}
              <Area dataKey={dataKey} stroke="none" fill="none" />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                width={48}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scrollable Chart Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="h-full min-w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                {/* Hidden Y-Axis to maintain grid alignment logic if needed, or omit */}
                <Tooltip
                  cursor={{
                    stroke: "#9ca3af",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  fillOpacity={1}
                  fill={`url(#${gradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
