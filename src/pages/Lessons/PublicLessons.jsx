import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useQuery } from "@tanstack/react-query";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Pagination } from "@mui/material";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserPlan from "../../hooks/useUserPlan";
import LessonCard from "../../components/lessons/LessonCard";
import Loading from "../../components/ui/Loading";
import SectionHeader from "../../components/ui/SectionHeader";

const PublicLessons = () => {
    const axiosSecure = useAxiosSecure();
    const { isPremium } = useUserPlan();
    const [searchParams, setSearchParams] = useSearchParams();
    const authorId = searchParams.get("authorId");

    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [emotionalTone, setEmotionalTone] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 6;

    const categories = [
        "All",
        "Personal Development",
        "Career",
        "Relationships",
        "Mindset",
        "Learning from Mistakes",
    ];

    const emotionalTones = [
        "All",
        "Motivational",
        "Sadness",
        "Realization",
        "Gratitude",
    ];

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "most-saved", label: "Most Saved" },
        { value: "most-liked", label: "Most Liked" },
    ];

    // Fetch all lessons once (up to 1000)
    const { data: allLessonsData, isLoading } = useQuery({
        queryKey: ["public-lessons"],
        queryFn: async () => {
            // Fetch a large number to handle client-side sorting effectively
            const res = await axiosSecure.get(`/lessons/public?limit=1000`);
            return res.data;
        },
    });

    const allLessons = allLessonsData?.lessons || [];

    // Filter and Sort Logic
    const processedData = allLessons
        .filter((lesson) => {
            // Search Filter
            const matchesSearch =
                searchTerm === "" ||
                lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lesson.description?.toLowerCase().includes(searchTerm.toLowerCase());

            // Category Filter
            const matchesCategory =
                category === "" || category === "All" || lesson.category === category;

            // Emotional Tone Filter
            const matchesTone =
                emotionalTone === "" ||
                emotionalTone === "All" ||
                lesson.emotionalTone === emotionalTone;

            // Author Filter
            const matchesAuthor =
                !authorId ||
                (lesson.creator &&
                    (lesson.creator._id === authorId || lesson.creator === authorId));

            return matchesSearch && matchesCategory && matchesTone && matchesAuthor;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "most-liked":
                    return (
                        (Number(b.likesCount) || b.likes?.length || 0) -
                        (Number(a.likesCount) || a.likes?.length || 0)
                    );
                case "most-saved":
                    return (
                        (Number(b.favoritesCount) || b.favorites?.length || 0) -
                        (Number(a.favoritesCount) || a.favorites?.length || 0)
                    );
                default:
                    return 0; // consistent default
            }
        });

    // Client-side Pagination
    const totalItems = processedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedLessons = processedData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-[url('./assets/bg2.png')] py-12">
            <Helmet>
                <title>Public Lessons | Digital Life Lessons</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Public Life Lessons"
                    subtitle="Learn from life experiences shared by everyone"
                />

                {/* Filters Bar */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-8 ">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search lessons..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </form>

                    {/* Filter Toggle Button (Mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden flex items-center gap-2 w-full justify-center px-4 py-2 bg-gray-100 rounded-lg font-medium mb-4"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter {showFilters ? "Hide" : "Show"}
                    </button>

                    {/* Filters */}
                    <div
                        className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? "block" : "hidden md:grid"
                            }`}
                    >
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat === "All" ? "" : cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Emotional Tone Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Emotional Tone
                            </label>
                            <select
                                value={emotionalTone}
                                onChange={(e) => {
                                    setEmotionalTone(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                {emotionalTones.map((tone) => (
                                    <option key={tone} value={tone === "All" ? "" : tone}>
                                        {tone}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Sort
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}

                    {(searchTerm ||
                        category ||
                        emotionalTone ||
                        sortBy !== "newest" ||
                        authorId) && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {searchTerm && (
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1">
                                        Search: {searchTerm}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => setSearchTerm("")}
                                        />
                                    </span>
                                )}
                                {category && (
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1">
                                        {category}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => setCategory("")}
                                        />
                                    </span>
                                )}
                                {emotionalTone && (
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1">
                                        {emotionalTone}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => setEmotionalTone("")}
                                        />
                                    </span>
                                )}
                                {authorId && (
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1">
                                        Filtered by Author
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => setSearchParams({})}
                                        />
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setCategory("");
                                        setEmotionalTone("");
                                        setSortBy("newest");
                                        setSearchParams({});
                                        setPage(1);
                                    }}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                </div>

                {/* Lessons Grid */}
                {isLoading ? (
                    <Loading fullScreen={false} />
                ) : paginatedLessons.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {paginatedLessons.map((lesson) => (
                                <LessonCard
                                    key={lesson._id}
                                    lesson={lesson}
                                    showBlur={lesson.accessLevel === "premium" && !isPremium}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center">
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                    sx={{
                                        "& .MuiPaginationItem-root": {},
                                    }}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Filter className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            No lessons found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Change your filters and try again
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setCategory("");
                                setEmotionalTone("");
                                setSortBy("newest");
                                setSearchParams({});
                                setPage(1);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicLessons;
