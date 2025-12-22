import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BookOpen,
  Heart,
  Users,
  TrendingUp,
  Lightbulb,
  Brain,
  Target,
  Sparkles,
} from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import useUserPlan from "../../hooks/useUserPlan";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LessonCard from "../../components/lessons/LessonCard";
import SectionHeader from "../../components/ui/SectionHeader";
import Loading from "../../components/ui/Loading";
import UserAvatar from "../../components/ui/UserAvatar";

const Home = () => {
  const { user } = useAuth();
  const { isPremium } = useUserPlan();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Fetch featured lessons
  const { data: featuredLessons = [], isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/featured");
      return res.data;
    },
  });

  // Fetch most saved lessons
  const { data: mostSavedData, isLoading: savedLoading } = useQuery({
    queryKey: ["most-saved-lessons"],
    queryFn: async () => {
      // using public endpoint with sort
      const res = await axiosSecure.get(
        "/lessons/public?sort=mostSaved&limit=6"
      );
      return res.data;
    },
  });
  const mostSavedLessons = mostSavedData?.lessons || [];

  // Fetch Top Contributors (Dynamic Calculation)
  const { data: topContributors = [], isLoading: contributorsLoading } =
    useQuery({
      queryKey: ["top-contributors"],
      queryFn: async () => {
        // Fetch 100 recent lessons to calculate "Top Contributors"
        const res = await axiosSecure.get("/lessons/public?limit=100");
        const lessons = res.data.lessons || [];

        // Helper to get author email efficiently
        const getAuthorEmail = (lesson) => {
          if (lesson.creator?.email) return lesson.creator.email;
          if (lesson.createdBy?.email) return lesson.createdBy.email;
          return lesson.creatorEmail || lesson.authorEmail;
        };

        // Helper to get author ID efficiently
        const getAuthorId = (lesson) => {
          if (
            lesson.creator &&
            typeof lesson.creator === "object" &&
            lesson.creator._id
          )
            return lesson.creator._id;
          if (
            lesson.creator &&
            typeof lesson.creator === "string" &&
            !lesson.creator.includes("@")
          )
            return lesson.creator;
          if (
            lesson.createdBy &&
            typeof lesson.createdBy === "object" &&
            lesson.createdBy._id
          )
            return lesson.createdBy._id;
          if (
            lesson.createdBy &&
            typeof lesson.createdBy === "string" &&
            !lesson.createdBy.includes("@")
          )
            return lesson.createdBy;
          return null;
        };

        const authorStats = {};

        lessons.forEach((lesson) => {
          const email = getAuthorEmail(lesson);
          if (!email) return;

          if (!authorStats[email]) {
            authorStats[email] = {
              name: lesson.creatorName || lesson.authorName || "Unknown",
              email: email,
              photoURL:
                lesson.creatorPhoto ||
                lesson.authorPhotoURL ||
                lesson.authorImage,
              count: 0,
              id: getAuthorId(lesson),
            };
          }
          authorStats[email].count++;
        });

        // Return top 4 contributors
        return Object.values(authorStats)
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);
      },
    });
  const heroSlides = [
    {
      title: "Turn Life Experiences Into Timeless Lessons",
      subtitle:
        "Capture your personal growth, reflect on real moments, and preserve the wisdom you’ve earned along the way.",
      image:
        "https://i.ibb.co.com/6RRk5WjZ/confident-businessman-looking-his-wrist-watch.webp",
    },
    {
      title: "Organize, Reflect, and Grow—All in One Place",
      subtitle:
        "Create lessons, categorize them by life areas, mark favorites, and track how far you’ve come.",
      image:
        "https://i.ibb.co.com/n84mPh7K/young-businessman-showing-graph-his-partner.webp",
    },
    {
      title: "Learn From Real People, Real Stories",
      subtitle:
        "Browse public lessons shared by others and discover perspectives that challenge and inspire you.",
      image:
        "https://i.ibb.co.com/QFtnyJTR/front-view-queer-students-outdoors.webp",
    },
  ];

  const benefits = [
    {
      icon: Brain,
      title: "Helps to understand yourself",
      description:
        "Writing down your thoughts and feelings helps you understand yourself better",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Lightbulb,
      title: "Learning from past mistakes",
      description: "Write down life mistakes so you don't repeat them",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Target,
      title: "Increase mental clarity",
      description: "Regular writing reduces stress and increases clarity",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Users,
      title: "Guideline from others' experience",
      description: "Find your path from experiences shared by others",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Home | Digital Life Lessons</title>
      </Helmet>
      {/* Hero Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ dynamicBullets: true }}
          loop
          className="h-[500px] md:h-[600px]"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-full relative flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70"></div>

                <div
                  className="max-w-4xl mx-auto text-center text-white relative z-10"
                  data-aos="zoom-in"
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p
                    className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-md"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    {slide.subtitle}
                  </p>
                  <div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <Link
                      to={user ? "/dashboard/add-lesson" : "/register"}
                      className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group"
                    >
                      <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                      </span>
                      <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0" />
                      <span className="relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                        Start writing lessons
                      </span>
                    </Link>

                    <Link
                      to="/public-lessons"
                      className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-all border-2 border-white/50 hover:border-white hover:scale-105"
                    >
                      View all lessons
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Lessons */}
      {/* bg-gradient-to-br from-gray-50 to-blue-50 */}
      <section className="py-16 bg-[url('./assets/bg.png')]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-down">
            <SectionHeader
              title="Featured Life Lessons"
              subtitle="Check out our best and popular lessons"
            />
          </div>

          {featuredLoading ? (
            <Loading fullScreen={false} />
          ) : featuredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLessons.slice(0, 6).map((lesson, index) => (
                <div
                  key={lesson._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <LessonCard
                    lesson={lesson}
                    showBlur={lesson.accessLevel === "premium" && !isPremium}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-aos="fade-up">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No featured lessons yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-down">
            <SectionHeader
              title="Why is learning from life important?"
              subtitle="Benefits of writing down your experience"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 120}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group overflow-hidden"
              >
                {/* Accent Bar */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${benefit.color} opacity-70`}
                />

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`shrink-0 w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300`}
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Saved Lessons */}
      {/* bg-gradient-to-br from-purple-50 to-pink-50 */}
      <section className="py-16 bg-[url('./assets/bg2.png')] opacity-70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10" data-aos="fade-down">
            <SectionHeader
              title="Most Saved Lessons"
              subtitle="Lessons that people frequently save"
              align="center"
            />
          </div>

          {/* Content */}
          {savedLoading ? (
            <Loading fullScreen={false} />
          ) : mostSavedLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mostSavedLessons.slice(0, 6).map((lesson, index) => (
                <div
                  key={lesson._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 120}
                >
                  <LessonCard
                    lesson={lesson}
                    showBlur={lesson.accessLevel === "premium" && !isPremium}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-14" data-aos="fade-up">
              <BookOpen className="w-14 h-14 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">
                No saved lessons available
              </p>
            </div>
          )}

          {/* CTA */}
          <div
            className="mt-12 flex justify-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link
              to="/public-lessons"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white border border-primary-200 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              View All Lessons
            </Link>
          </div>
        </div>
      </section>

      {/* Top Contributors Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-down">
            <SectionHeader
              title="Top Contributors of the Week"
              subtitle="Recognizing our most active community members"
            />
          </div>

          {contributorsLoading ? (
            <Loading fullScreen={false} />
          ) : topContributors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topContributors.map((w, index) => (
                // <div
                //   key={w.email || index}
                //   data-aos="fade-up"
                //   data-aos-delay={index * 100}
                //   className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all"
                // >
                //   <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                //     <UserAvatar user={w} size="lg" />
                //   </div>
                //   <h3 className="text-lg font-bold text-gray-900 mb-1">
                //     {w.name}
                //   </h3>
                //   <p className="text-primary-600 font-medium text-sm mb-3">
                //     {w.count} Lessons
                //   </p>

                //   {w.id && !w.id.includes("@") ? (
                //     <Link
                //       to={`/author/${w.id}`}
                //       className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                //     >
                //       View Profile
                //     </Link>
                //   ) : (
                //     <span className="text-sm text-gray-400">
                //       Community Member
                //     </span>
                //   )}
                // </div>
                <div
                  key={w.email || index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  {/* Top Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={w} size="md" />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {w.name}
                        </h3>
                        <p className="text-xs text-gray-500">Contributor</p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-600">
                      {w.count}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Bottom */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Lessons shared</span>

                    {w.id && !w.id.includes("@") ? (
                      <Link
                        to={`/author/${w.id}`}
                        className="text-primary-600 font-semibold hover:underline"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-400">Community</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-aos="fade-up">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active contributors this week</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
