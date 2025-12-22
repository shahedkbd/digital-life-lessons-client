import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Edit,
  Trash2,
  Eye,
  Heart,
  Bookmark,
  Lock,
  Unlock,
  BookOpen,
  DollarSign,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/ui/Loading";
import useUserPlan from "../../hooks/useUserPlan";

const MyLessons = () => {
  const { isPremium } = useUserPlan();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["my-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/my");
      return res.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-lessons"]);
      queryClient.invalidateQueries(["user-stats"]);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Lesson deleted",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, visibility }) => {
      await axiosSecure.patch(`/lessons/${id}`, { visibility });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-lessons"]);
    },
  });

  const toggleAccessLevelMutation = useMutation({
    mutationFn: async ({ id, accessLevel }) => {
      await axiosSecure.patch(`/lessons/${id}`, { accessLevel });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-lessons"]);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Access level updated",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      // Revert if failed (though invalidate will fix UI eventually)
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to update access level",
        text: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  const handleDelete = (id, title) => {
    Swal.fire({
      title: "Confirm",
      text: `Do you want to delete lesson "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      customClass: {
        title: "bangla-text",
        htmlContainer: "bangla-text",
        confirmButton: "bangla-text",
        cancelButton: "bangla-text",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleToggleVisibility = (id, currentVisibility) => {
    const newVisibility = currentVisibility === "public" ? "private" : "public";
    toggleVisibilityMutation.mutate({ id, visibility: newVisibility });
  };

  const handleToggleAccessLevel = (id, currentAccessLevel) => {
    if (!isPremium) {
      Swal.fire({
        title: "Premium Required",
        text: "You need to be a premium member to create premium lessons.",
        icon: "warning",
        confirmButtonText: "Upgrade Now",
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to pricing
          window.location.href = "/pricing";
        }
      });
      return;
    }
    const newAccessLevel =
      currentAccessLevel === "free" ? "premium" : "free";
    toggleAccessLevelMutation.mutate({ id, accessLevel: newAccessLevel });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [filterAccess, setFilterAccess] = useState("all");

  const categories = [...new Set(lessons.map((lesson) => lesson.category))];

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || lesson.category === filterCategory;
    const matchesVisibility =
      filterVisibility === "all" || lesson.visibility === filterVisibility;
    const matchesAccess =
      filterAccess === "all" || lesson.accessLevel === filterAccess;

    return (
      matchesSearch && matchesCategory && matchesVisibility && matchesAccess
    );
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <Helmet>
        <title>My Lessons | Digital Life Lessons</title>
      </Helmet>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Lessons</h1>
          <p className="text-gray-600">Total {lessons.length} lessons</p>
        </div>
        <Link
          to="/dashboard/add-lesson"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg"
        >
          <BookOpen className="w-5 h-5" />
          New Lesson
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filterVisibility}
          onChange={(e) => setFilterVisibility(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <select
          value={filterAccess}
          onChange={(e) => setFilterAccess(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Access Levels</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No lessons yet
          </h3>
          <p className="text-gray-600 mb-6">Create your first life lesson</p>
          <Link
            to="/dashboard/add-lesson"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Create Lesson
          </Link>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <p className="text-gray-600">No lessons match your filters.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("all");
              setFilterVisibility("all");
              setFilterAccess("all");
            }}
            className="mt-4 text-primary-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <TableContainer component={Paper} className="rounded-2xl shadow-md">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-bold">Title</TableCell>
                <TableCell className="font-bold">Category</TableCell>
                <TableCell className="font-bold">Tone</TableCell>
                <TableCell className="font-bold">Privacy</TableCell>
                <TableCell className="font-bold">Access</TableCell>
                <TableCell className="font-bold">Date</TableCell>
                <TableCell className="font-bold">Stats</TableCell>
                <TableCell className="font-bold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLessons.map((lesson) => (
                <TableRow key={lesson._id} hover>
                  <TableCell className="font-medium max-w-xs">
                    <div className="line-clamp-2">{lesson.title}</div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lesson.category}
                      size="small"
                      className=""
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lesson.emotionalTone}
                      size="small"
                      className=""
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        lesson.visibility === "public" ? "Public" : "Private"
                      }
                      size="small"
                      className=""
                      color={
                        lesson.visibility === "public" ? "success" : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        lesson.accessLevel === "premium" ? "Premium" : "Free"
                      }
                      size="small"
                      className=""
                      color={
                        lesson.accessLevel === "premium" ? "warning" : "info"
                      }
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(lesson.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {lesson.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="w-4 h-4" />
                        {lesson.favoritesCount || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Tooltip title="View">
                        <Link to={`/lesson/${lesson._id}`}>
                          <IconButton size="small" color="primary">
                            <Eye className="w-4 h-4" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <Link to={`/dashboard/update-lesson/${lesson._id}`}>
                          <IconButton size="small" color="info">
                            <Edit className="w-4 h-4" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip
                        title={
                          lesson.visibility === "public"
                            ? "Make Private"
                            : "Make Public"
                        }
                      >
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() =>
                            handleToggleVisibility(
                              lesson._id,
                              lesson.visibility
                            )
                          }
                        >
                          {lesson.visibility === "public" ? (
                            <Unlock className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title={
                          !isPremium
                            ? "Upgrade to change access level"
                            : lesson.accessLevel === "free"
                              ? "Make Premium"
                              : "Make Free"
                        }
                      >
                        <div>
                          <IconButton
                            size="small"
                            color={
                              lesson.accessLevel === "premium"
                                ? "warning"
                                : "default"
                            }
                            onClick={() =>
                              handleToggleAccessLevel(
                                lesson._id,
                                lesson.accessLevel
                              )
                            }
                            disabled={!isPremium}
                          >
                            <DollarSign className="w-4 h-4" />
                          </IconButton>
                        </div>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(lesson._id, lesson.title)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MyLessons;
