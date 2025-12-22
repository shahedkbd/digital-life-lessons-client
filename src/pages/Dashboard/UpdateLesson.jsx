import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Save, Image } from "lucide-react";
import Swal from "sweetalert2";
import useUserPlan from "../../hooks/useUserPlan";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/ui/Loading";
import { uploadImage } from "../../utils/imageUpload";

const UpdateLesson = () => {
  const { id } = useParams();
  const { isPremium } = useUserPlan();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        emotionalTone: lesson.emotionalTone,
        emotionalTone: lesson.emotionalTone,
        image: [], // Reset file input
        visibility: lesson.visibility,
        accessLevel: lesson.accessLevel,
      });
    }
  }, [lesson, reset]);

  const updateLessonMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.patch(`/lessons/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-lessons"]);
      queryClient.invalidateQueries(["lesson", id]);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Lesson updated successfully",
        confirmButtonText: "Thank you",
      });

      navigate("/dashboard/my-lessons");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to update lesson",
        confirmButtonText: "Okay",
      });
    },
  });

  const onSubmit = async (data) => {
    try {
      let imageURL = lesson.image; // Default to existing image

      // If a new image file is selected, upload it
      if (data.image && data.image.length > 0) {
        const imageFile = data.image[0];
        imageURL = await uploadImage(imageFile);
      }

      const updateData = {
        ...data,
        image: imageURL,
      };

      updateLessonMutation.mutate(updateData);
    } catch (error) {
      console.error("Error updating lesson:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload image or prepare data",
      });
    }
  };

  const categories = [
    "Personal Development",
    "Career",
    "Relationships",
    "Mindset",
    "Learning from Mistakes",
  ];

  const emotionalTones = [
    "Motivational",
    "Sadness",
    "Realization",
    "Gratitude",
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Update Lesson | Digital Life Lessons</title>
      </Helmet>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Update Lesson</h1>
            <p className="text-gray-600">Edit your lesson</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
              })}
              rows="8"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "Select Category" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emotional Tone <span className="text-red-500">*</span>
              </label>
              <select
                {...register("emotionalTone", { required: "Select Tone" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
              {errors.emotionalTone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.emotionalTone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lesson Image (Optional)
            </label>
            <div className="relative">
              <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
            {lesson.image && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                <img
                  src={lesson.image}
                  alt="Current"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Privacy
              </label>
              <select
                {...register("visibility")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Access Level
              </label>
              <select
                {...register("accessLevel")}
                disabled={!isPremium}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="free">Free</option>
                <option value="premium" disabled={!isPremium}>
                  Premium {!isPremium && "(Upgrade Required)"}
                </option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={updateLessonMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {updateLessonMutation.isPending ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-lessons")}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default UpdateLesson;
