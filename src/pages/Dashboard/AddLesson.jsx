import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { BookOpen, Save, Image } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Lottie from "lottie-react";
import useUserPlan from "../../hooks/useUserPlan";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { uploadImage } from "../../utils/imageUpload";
import successAnimation from "../../assets/success.json";

const MySwal = withReactContent(Swal);

const AddLesson = () => {
  const { isPremium } = useUserPlan();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      visibility: "public",
      accessLevel: "free",
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/lessons", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-lessons"]);
      queryClient.invalidateQueries(["user-stats"]);

      MySwal.fire({
        html: (
          <div className="flex flex-col items-center">
            <div className="w-40 h-40">
              <Lottie animationData={successAnimation} loop={false} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">Success!</h3>
            <p className="text-gray-600 mt-2">Lesson created successfully</p>
          </div>
        ),
        showConfirmButton: true,
        confirmButtonText: "Thank you",
        customClass: {
          popup: "rounded-2xl",
          confirmButton:
            "bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-all border-none font-semibold",
        },
        buttonsStyling: false,
      });

      reset();
      navigate("/dashboard/my-lessons");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to create lesson",
        confirmButtonText: "Okay",
      });
    },
  });

  const onSubmit = async (data) => {
    try {
      let imageURL = "";
      if (data.image && data.image.length > 0) {
        const imageFile = data.image[0];
        imageURL = await uploadImage(imageFile);
      }

      const lessonData = {
        ...data,
        image: imageURL,
      };

      createLessonMutation.mutate(lessonData);
    } catch (error) {
      console.error("Error preparing lesson data:", error);
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

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Add Lesson | Digital Life Lessons</title>
      </Helmet>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Lesson
            </h1>
            <p className="text-gray-600">Share your life experience</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
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
              placeholder="Enter your lesson title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
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
              placeholder="Write your life lesson details..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category & Emotional Tone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "Select Category" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select</option>
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
                <option value="">Select</option>
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

          {/* Image Upload */}
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
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Visibility & Access Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Privacy
              </label>
              <select
                {...register("visibility")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bangla-text"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 bangla-text mb-2">
                Access Level
              </label>
              <select
                {...register("accessLevel")}
                disabled={!isPremium}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bangla-text disabled:bg-gray-100 disabled:cursor-not-allowed"
                title={!isPremium ? "Upgrade to create premium lessons" : ""}
              >
                <option value="free">Free</option>
                <option value="premium" disabled={!isPremium}>
                  Premium {!isPremium && "(Upgrade Required)"}
                </option>
              </select>
              {!isPremium && (
                <p className="mt-1 text-sm text-yellow-600 bangla-text">
                  💎 Upgrade to create premium lessons
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={createLessonMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all bangla-text shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-lessons")}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all bangla-text"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default AddLesson;
