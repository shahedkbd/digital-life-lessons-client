import { Heart, Bookmark, Eye, Lock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import UserAvatar from "../ui/UserAvatar";

const LessonCard = ({ lesson, showBlur = false }) => {
  if (!lesson) return null;

  const {
    _id,
    title,
    description,
    category,
    emotionalTone,
    accessLevel,
    creator,
    image,
    creatorName,
    creatorPhoto,
    creatorEmail,
    createdBy,
    views = Math.floor(Math.random() * 10000),
    createdAt,
  } = lesson;

  const getAuthor = () => {
    if (creator && typeof creator === "object") return creator;
    if (createdBy && typeof createdBy === "object") return createdBy;
    return {
      name: creatorName || "Unknown Author",
      photoURL: creatorPhoto,
      email: creatorEmail,
    };
  };

  const displayAuthor = getAuthor();
  const isPremium = accessLevel === "premium";

  const displayLikesCount =
    Number(lesson.likesCount) || lesson.likes?.length || 0;
  const displayFavoritesCount =
    Number(lesson.favoritesCount) || lesson.favorites?.length || 0;

  const categoryColors = {
    "Personal Development": "bg-blue-100 text-blue-700",
    Career: "bg-green-100 text-green-700",
    Relationships: "bg-pink-100 text-pink-700",
    Mindset: "bg-purple-100 text-purple-700",
    "Learning from Mistakes": "bg-orange-100 text-orange-700",
  };

  const toneColors = {
    Motivational: "bg-yellow-100 text-yellow-700",
    Sadness: "bg-gray-100 text-gray-700",
    Realization: "bg-indigo-100 text-indigo-700",
    Gratitude: "bg-teal-100 text-teal-700",
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Premium Overlay */}
      {showBlur && isPremium && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur flex items-center justify-center">
          <div className="text-center px-6">
            <Lock className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <p className="font-bold text-gray-900 mb-2">Premium Content</p>
            <Link
              to="/pricing"
              className="inline-block px-5 py-2 bg-yellow-600 text-white rounded-full text-sm font-semibold"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      {/* Image Section */}
      {image && (
        <div className={`relative h-44 ${showBlur && isPremium ? "blur-sm" : ""}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[category] || "bg-gray-100 text-gray-700"}`}>
              {category}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${toneColors[emotionalTone] || "bg-gray-100 text-gray-700"}`}>
              {emotionalTone}
            </span>
            {isPremium && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                Premium
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`p-5 flex flex-col flex-1 ${showBlur && isPremium ? "blur-sm" : ""}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
          {title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <UserAvatar user={displayAuthor} size="sm" />
          <span>{displayAuthor.name}</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {displayLikesCount}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" /> {displayFavoritesCount}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {views}
              </span>
            </div>
          </div>

          <Link
            to={`/lesson/${_id}`}
            className="block text-center border border-primary-600 text-primary-600 py-2 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all"
          >
            Read Lesson
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;

