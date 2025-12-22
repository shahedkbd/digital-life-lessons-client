import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Heart,
    Bookmark,
    Eye,
    Calendar,
    Lock,
    Share2,
    Flag,
    BookOpen,
    Clock,
    ArrowLeft,
    Send,
} from "lucide-react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useUserPlan from "../../hooks/useUserPlan";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import UserAvatar from "../../components/ui/UserAvatar";
import Loading from "../../components/ui/Loading";
import LessonCard from "../../components/lessons/LessonCard";

const LessonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, userDetails } = useAuth();
    const { isPremium } = useUserPlan();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportDescription, setReportDescription] = useState("");
    const [comment, setComment] = useState("");

    // Fetch lesson details
    const { data: lesson, isLoading } = useQuery({
        queryKey: ["lesson", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/lessons/${id}`);

            return res.data;
        },
    });

    // Fetch similar lessons by category
    const { data: similarByCategoryData } = useQuery({
        queryKey: ["similar-category", lesson?.category],
        queryFn: async () => {
            if (!lesson?.category) return { lessons: [] };
            const res = await axiosSecure.get(
                `/lessons/public?category=${lesson.category}&limit=6`
            );
            return res.data;
        },
        enabled: !!lesson?.category,
    });
    const similarByCategory = similarByCategoryData?.lessons || [];

    // Fetch similar lessons by tone
    const { data: similarByToneData } = useQuery({
        queryKey: ["similar-tone", lesson?.emotionalTone],
        queryFn: async () => {
            if (!lesson?.emotionalTone) return { lessons: [] };
            const res = await axiosSecure.get(
                `/lessons/public?emotionalTone=${lesson.emotionalTone}&limit=6`
            );
            return res.data;
        },
        enabled: !!lesson?.emotionalTone,
    });
    const similarByTone = similarByToneData?.lessons || [];

    // Fetch comments
    const { data: comments = [] } = useQuery({
        queryKey: ["comments", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/lessons/${id}/comments`);
            return res.data;
        },
    });

    // Fetch user favorites to check status
    const { data: userFavorites = [] } = useQuery({
        queryKey: ["userFavorites"],
        queryFn: async () => {
            if (!user) return [];
            const res = await axiosSecure.get(`/lessons/favorites`);
            return res.data;
        },
        enabled: !!user,
    });

    // Determine if the current lesson is favorited by the user
    // The favorite object might be the lesson itself or an object containing the lesson
    const isFavorited = userFavorites.some((fav) => {
        const favId = fav.lesson?._id || fav._id;
        return favId === id;
    });

    // Like mutation with Optimistic Update
    const likeMutation = useMutation({
        mutationFn: async () => {
            const res = await axiosSecure.patch(`/lessons/${id}/like`);
            return res.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries(["lesson", id]);
            const previousLesson = queryClient.getQueryData(["lesson", id]);

            queryClient.setQueryData(["lesson", id], (old) => {
                if (!old) return old;
                // Use userDetails._id which matches the MongoDB ObjectIds in the likes array
                const userId = userDetails?._id;
                if (!userId) return old; // Sould generally not happen if logged in

                const isLiked = old.likes?.includes(userId);
                const newLikes = isLiked
                    ? old.likes.filter((uid) => uid !== userId)
                    : [...(old.likes || []), userId];

                return {
                    ...old,
                    likes: newLikes,
                    likesCount: isLiked
                        ? Math.max((old.likesCount || 0) - 1, 0)
                        : (old.likesCount || 0) + 1,
                };
            });

            return { previousLesson };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(["lesson", id], context.previousLesson);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to update like",
                showConfirmButton: false,
                timer: 2000,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(["lesson", id]);
        },
    });

    // Favorite mutation with Optimistic Update
    const favoriteMutation = useMutation({
        mutationFn: async (currentlyFavorited) => {
            if (currentlyFavorited) {
                const res = await axiosSecure.delete(`/lessons/favorites/${id}`);
                return res.data;
            } else {
                const res = await axiosSecure.post(`/lessons/favorites/${id}`);
                return res.data;
            }
        },
        onMutate: async (currentlyFavorited) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(["lesson", id]);
            await queryClient.cancelQueries(["userFavorites"]);

            // Snapshot the previous values
            const previousLesson = queryClient.getQueryData(["lesson", id]);
            const previousFavorites = queryClient.getQueryData(["userFavorites"]);

            // Optimistically update lesson stats
            queryClient.setQueryData(["lesson", id], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    favoritesCount: currentlyFavorited
                        ? Math.max((old.favoritesCount || 0) - 1, 0)
                        : (old.favoritesCount || 0) + 1,
                };
            });

            // Optimistically update user's favorites list (toggle presence)
            queryClient.setQueryData(["userFavorites"], (old = []) => {
                if (currentlyFavorited) {
                    // Remove
                    return old.filter((fav) => (fav.lesson?._id || fav._id) !== id);
                } else {
                    // Add (mock structure)
                    // We don't have the full object here, but we can add what we have so the check passes
                    return [...old, { _id: id, lesson: lesson }];
                }
            });

            return { previousLesson, previousFavorites };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(["lesson", id], context.previousLesson);
            queryClient.setQueryData(["userFavorites"], context.previousFavorites);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to update favorite",
                showConfirmButton: false,
                timer: 2000,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(["lesson", id]);
            queryClient.invalidateQueries(["userFavorites"]);
            queryClient.invalidateQueries(["my-favorites"]); // Also invalidate the dashboard query
        },
        onSuccess: (data, currentlyFavorited) => {
            const message = currentlyFavorited
                ? "Removed from favorites"
                : "Added to favorites";
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: message,
                showConfirmButton: false,
                timer: 1500,
            });
        },
    });

    // Report mutation
    const reportMutation = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.post(`/lessons/${id}/report`, {
                reason: data.reason,
                message: data.description,
            });
            return res.data;
        },
        onSuccess: () => {
            setReportDialogOpen(false);
            setReportReason("");
            setReportDescription("");
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Report submitted successfully",
                showConfirmButton: false,
                timer: 3000,
            });
        },
    });

    // Comment mutation
    const commentMutation = useMutation({
        mutationFn: async (text) => {
            const res = await axiosSecure.post(`/lessons/${id}/comments`, { text });
            return res.data;
        },
        onSuccess: () => {
            setComment("");
            queryClient.invalidateQueries(["comments", id]);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Comment added",
                showConfirmButton: false,
                timer: 2000,
            });
        },
    });

    const handleLike = () => {
        if (!user) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Please log in to like",
                showConfirmButton: false,
                timer: 3000,
            });
            // Optional: navigate('/login');
            return;
        }
        likeMutation.mutate();
    };

    const handleFavorite = () => {
        if (!user) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Please log in to add to favorites",
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }
        // Use the derived isFavorited state
        favoriteMutation.mutate(isFavorited);
    };

    const handleReport = () => {
        if (!user) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Please login first",
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }
        setReportDialogOpen(true);
    };

    const submitReport = () => {
        if (!reportReason) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Select a reason for reporting",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        reportMutation.mutate({
            lessonId: id,
            reason: reportReason,
            description: reportDescription,
        });
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: lesson.title,
                    text: lesson.description,
                    url,
                });
            } catch (error) { }
        } else {
            navigator.clipboard.writeText(url);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Link copied",
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "Please login first to comment",
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }
        if (!comment.trim()) return;
        commentMutation.mutate(comment);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString({
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200;
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    if (isLoading) return <Loading />;

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Lesson not found
                    </h2>
                    <Link
                        to="/public-lessons"
                        className="text-primary-600 hover:underline"
                    >
                        Back to public lessons
                    </Link>
                </div>
            </div>
        );
    }

    const author = lesson.creator || {};
    const authorId =
        author._id ||
        author.id ||
        (typeof lesson.creator === "string" ? lesson.creator : undefined) ||
        lesson.creatorId ||
        lesson.userId;

    const authorName =
        author.name ||
        author.displayName ||
        lesson.creatorName ||
        lesson.authorName ||
        "Unknown Author";
    const authorEmail = author.email || lesson.creatorEmail || "";
    // Include creatorPhoto (from user JSON) in fallback chain
    const authorImage =
        author?.photoURL ||
        author?.image ||
        lesson.creatorPhoto ||
        lesson.creatorImage;
    // Create a normalized user object for UserAvatar
    const displayUser = {
        ...author,
        displayName: authorName,
        photoURL: authorImage,
    };

    const isPremiumLesson = lesson.accessLevel === "premium";
    const canView = !isPremiumLesson || isPremium;
    // Check using userDetails._id which comes from MongoDB
    const isLiked = lesson.likes?.includes(userDetails?._id);

    const hasLikes = (lesson.likes?.length || 0) > 0;
    const hasFavorites = (lesson.favoritesCount || 0) > 0;

    const reportReasons = [
        "Inappropriate Content",
        "Hate or Harassment",
        "False or Misleading Information",
        "Spam",
        "Sensitive or Disturbing Content",
        "Other",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <Helmet>
                <title>{lesson.title} | Digital Life Lessons</title>
            </Helmet>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Go Back
                </button>

                {/* Premium Lock Banner */}
                {isPremiumLesson && !isPremium && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <Lock className="w-12 h-12" />
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-1">
                                    This is a premium lesson
                                </h3>
                                <p className="bangla-text opacity-90">
                                    Upgrade to premium plan to view this lesson.
                                </p>
                            </div>
                            <Link
                                to="/pricing"
                                className="px-6 py-3 bg-white text-yellow-600 rounded-lg font-bold hover:bg-gray-100 transition-all whitespace-nowrap"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden ${!canView ? "blur-sm pointer-events-none" : ""
                        }`}
                >
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                {lesson.category}
                            </span>
                            <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                {lesson.emotionalTone}
                            </span>
                            {isPremiumLesson && (
                                <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full text-sm font-semibold premium-glow">
                                    ⭐ Premium
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {lesson.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="bangla-text">
                                    {formatDate(lesson.createdAt)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="bangla-text">
                                    {calculateReadingTime(lesson.description)} min read
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{Math.floor(Math.random() * 10000)} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    Updated: {formatDate(lesson.updatedAt || lesson.createdAt)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {lesson.visibility === "public" ? (
                                    <Eye className="w-4 h-4" />
                                ) : (
                                    <Lock className="w-4 h-4" />
                                )}
                                <span className="capitalize">{lesson.visibility}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="prose max-w-none">
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                {lesson.description}
                            </p>
                        </div>

                        {lesson.image && (
                            <div className="mt-6">
                                <img
                                    src={lesson.image}
                                    alt={lesson.title}
                                    className="w-full max-w-2xl mx-auto rounded-xl shadow-md"
                                />
                            </div>
                        )}
                    </div>

                    {/* Stats & Actions */}
                    <div className="p-8 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Heart
                                        className={`w-5 h-5 ${hasLikes ? "fill-red-500 text-red-500" : ""
                                            }`}
                                    />
                                    <span className="font-semibold">
                                        {lesson.likesCount || 0}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Bookmark
                                        className={`w-5 h-5 ${hasFavorites ? "fill-primary-500 text-primary-500" : ""
                                            }`}
                                    />
                                    <span className="font-semibold">
                                        {lesson.favoritesCount || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 ${isLiked
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <Heart
                                    className={`w-5 h-5 ${hasLikes ? "fill-current" : ""}`}
                                />
                                {isLiked ? "Liked" : "Like"}
                            </button>

                            <button
                                onClick={handleFavorite}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 ${isFavorited
                                    ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <Bookmark
                                    className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
                                />
                                {isFavorited ? "Saved" : "Save"}
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all active:scale-95"
                            >
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>

                            <button
                                onClick={handleReport}
                                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all active:scale-95"
                            >
                                <Flag className="w-5 h-5" />
                                Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dedicated Author Section Card */}
                <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                        About the Creator
                    </h3>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <UserAvatar
                            user={displayUser}
                            size="xl"
                            className="w-24 h-24 text-3xl"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">
                                {authorName}
                            </h4>
                            {authorEmail && (
                                <p className="text-gray-500 mb-4">{authorEmail}</p>
                            )}

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium mb-4">
                                <BookOpen className="w-4 h-4" />
                                <span>{author.totalLessons || 0} Lessons Created</span>
                            </div>

                            <div className="mt-2">
                                {authorId && (
                                    <Link
                                        to={`/author/${authorId}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-500 text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-all shadow-sm hover:shadow-md"
                                    >
                                        View all lessons by this author
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dedicated Comments Section Card */}
                <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Comments ({comments.length})
                    </h3>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your opinion..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-gray-50"
                        />
                        <button
                            type="submit"
                            disabled={!comment.trim() || commentMutation.isPending}
                            className="mt-3 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            <Send className="w-4 h-4" />
                            Post Comment
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map((c) => (
                                <div
                                    key={c._id}
                                    className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                                >
                                    <div className="flex items-start gap-4">
                                        <UserAvatar user={c.user} size="md" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-900">
                                                    {c.user?.name || c.user?.displayName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    • {formatDate(c.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{c.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                No comments yet. Be the first to share your thoughts!
                            </p>
                        )}
                    </div>
                </div>

                {/* Similar Lessons */}
                {similarByCategory.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            More lessons in this category
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarByCategory.slice(0, 6).map((l) => (
                                <LessonCard
                                    key={l._id}
                                    lesson={l}
                                    showBlur={l.accessLevel === "premium" && !isPremium}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {similarByTone.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            More lessons with this tone
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarByTone.slice(0, 6).map((l) => (
                                <LessonCard
                                    key={l._id}
                                    lesson={l}
                                    showBlur={l.accessLevel === "premium" && !isPremium}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Report Dialog */}
            <Dialog
                open={reportDialogOpen}
                onClose={() => setReportDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle className="bangla-text">Report Lesson</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        label="Reason for report"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        margin="normal"
                        className="bangla-text"
                    >
                        {reportReasons.map((reason) => (
                            <MenuItem key={reason} value={reason} className="bangla-text">
                                {reason}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Details (Optional)"
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        margin="normal"
                        className="bangla-text"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setReportDialogOpen(false)}
                        className="bangla-text"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={submitReport}
                        variant="contained"
                        color="error"
                        disabled={reportMutation.isPending}
                        className="bangla-text"
                    >
                        Submit Report
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LessonDetails;
