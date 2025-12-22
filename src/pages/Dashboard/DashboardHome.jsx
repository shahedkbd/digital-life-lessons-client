import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BookOpen, Bookmark, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import StatsCard from "../../components/ui/StatsCard";
import Loading from "../../components/ui/Loading";
import LessonCard from "../../components/lessons/LessonCard";
import SectionHeader from "../../components/ui/SectionHeader";

const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [chartView, setChartView] = useState("weekly");

  // Fetch User Details for Total Likes
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user-stats-profile"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/me");
      return res.data;
    },
  });

  // Fetch My Lessons for Public Lessons count and Recent Lessons
  const { data: myLessons = [], isLoading: lessonsQueryLoading } = useQuery({
    queryKey: ["my-lessons-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/my");
      return res.data || [];
    },
  });

  // Calculate Public Lessons and Total Likes (using user data as requested)
  const publicLessonsCount = myLessons.filter(
    (lesson) => lesson.visibility === "public"
  ).length;

  const totalLikes = userData?.totalLikes || 0;

  const stats = {
    totalLikes: totalLikes,
    totalLessons: myLessons.length,
    publicLessons: publicLessonsCount,
    totalFavorites: userData?.totalFavorites || 0,
    recentLessons: myLessons.slice(0, 3) || [],
  };

  const chartData = useMemo(() => {
    // If data is loading or empty, return placeholder data or empty
    if (!myLessons) return [];

    const now = new Date();
    const data = [];

    if (chartView === "weekly") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        data.push({
          name: dayName,
          date: d.toISOString().split("T")[0],
          count: 0,
        });
      }

      myLessons.forEach((lesson) => {
        if (!lesson.createdAt) return;
        const date = new Date(lesson.createdAt).toISOString().split("T")[0];
        const item = data.find((d) => d.date === date);
        if (item) item.count++;
      });
    } else {
      // Monthly view (Last 6 months)
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleDateString("en-US", { month: "short" });
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        data.push({
          name: monthName,
          key: key,
          count: 0,
        });
      }
      myLessons.forEach((lesson) => {
        if (!lesson.createdAt) return;
        const d = new Date(lesson.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const item = data.find((i) => i.key === key);
        if (item) item.count++;
      });
    }
    return data;
  }, [myLessons, chartView]);

  const recentLessons = stats.recentLessons;
  const statsLoading = userLoading || lessonsQueryLoading;
  const lessonsLoading = lessonsQueryLoading;

  if (statsLoading) return <Loading />;

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Dashboard | Digital Life Lessons</title>
      </Helmet>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome, {user?.displayName || "User"}!
        </h1>
        <p className="text-lg opacity-90">
          Welcome to your dashboard. Here you can see all your lessons and
          activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Lessons"
          value={stats?.totalLessons || 0}
          icon={BookOpen}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Saved Lessons"
          value={stats?.totalFavorites || 0}
          icon={Bookmark}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Total Likes"
          value={stats?.totalLikes || 0}
          icon={Heart}
          bgColor="bg-pink-50"
          iconColor="text-pink-600"
          trend="up"
          trendValue="+8%"
        />
        <StatsCard
          title="Public Lessons"
          value={stats?.publicLessons || 0}
          icon={TrendingUp}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/add-lesson"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg"
          >
            <BookOpen className="w-5 h-5" />
            Add New Lesson
          </Link>
          <Link
            to="/dashboard/my-lessons"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            My Lessons
          </Link>
          <Link
            to="/dashboard/my-favorites"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            <Bookmark className="w-5 h-5" />
            Saved Lessons
          </Link>
          <Link
            to="/dashboard/profile"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            Profile
          </Link>
        </div>
      </div>

      {/* Recent Lessons */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Lessons</h2>
          <Link
            to="/dashboard/my-lessons"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            View All →
          </Link>
        </div>

        {lessonsLoading ? (
          <Loading fullScreen={false} />
        ) : recentLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No lessons yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first life lesson and share with others
            </p>
            <Link
              to="/dashboard/add-lesson"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Create Lesson
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Activity & contributions
          </h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartView("weekly")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${chartView === "weekly"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartView("monthly")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${chartView === "monthly"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
                barSize={40}
                name="Lessons Created"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
