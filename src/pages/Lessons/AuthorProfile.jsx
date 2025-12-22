import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, MapPin, Calendar, Mail } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LessonCard from "../../components/lessons/LessonCard";
import UserAvatar from "../../components/ui/UserAvatar";
import Loading from "../../components/ui/Loading";

const AuthorProfile = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  // Fetch author's public lessons
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["author-lessons", id],
    queryFn: async () => {
      if (!id || id === "undefined" || id === "null") return [];
      const res = await axiosSecure.get(`/lessons/author/${id}`);
      // Check if response is an array or object with lessons property
      return Array.isArray(res.data) ? res.data : res.data.lessons || [];
    },
    enabled: !!id && id !== "undefined" && id !== "null",
  });

  if (isLoading) return <Loading />;

  let author = null;
  if (lessons.length > 0) {
    const firstLesson = lessons[0];

    // Priority 1: Full `creator` object
    if (firstLesson.creator && typeof firstLesson.creator === "object") {
      author = firstLesson.creator;
    }
    // Priority 2: `createdBy` object (sometimes used by different backend framworks/seeds)
    else if (
      firstLesson.createdBy &&
      typeof firstLesson.createdBy === "object"
    ) {
      author = firstLesson.createdBy;
    }
    // Priority 3: Construct from flat fields if object is missing
    else {
      author = {
        name: firstLesson.creatorName || "Author",
        email: firstLesson.creatorEmail || "",
        photoURL: firstLesson.creatorPhoto || firstLesson.creatorImage,
        // If we are here, we might not have the ID if it's not in the lesson
        _id: id,
      };
    }
  }

  if (!author && lessons.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md">
          <UserAvatar size="xl" />
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Author info not available
          </h2>
          <p className="text-gray-600 mt-2">
            This author hasn't posted any public lessons yet or simply doesn't
            exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Author Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <UserAvatar
              user={author}
              size="xl"
              className="w-32 h-32 text-4xl"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {author?.name || author?.displayName || "Author"}
            </h1>
            <p className="text-gray-600 mb-4">{author?.email}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-600" />
                <span className="font-semibold text-gray-900">
                  {lessons.length}
                </span>{" "}
                Lessons Shared
              </div>
              {/* Add more stats if available */}
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Shared Lessons
        </h2>
        {lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No lessons to display.</p>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;
