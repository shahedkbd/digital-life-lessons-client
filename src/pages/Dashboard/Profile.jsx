import { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { User, Mail, Save, Star } from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { uploadImage } from "../../utils/imageUpload";
import UserAvatar from "../../components/ui/UserAvatar";
import LessonCard from "../../components/lessons/LessonCard";
import Loading from "../../components/ui/Loading";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user stats & role
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["user-profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/me");
      return res.data;
    },
  });

  // Fetch user's public lessons
  const { data: myLessons = [] } = useQuery({
    queryKey: ["my-public-lessons", dbUser?._id],
    queryFn: async () => {
      if (!dbUser?._id) return [];
      const res = await axiosSecure.get(`/lessons/author/${dbUser._id}`);
      return res.data || [];
    },
    enabled: !!dbUser?._id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      photoURL: user?.photoURL || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      let photoURL = user?.photoURL;

      // Upload new image if selected
      if (data.image && data.image[0]) {
        const uploadedUrl = await uploadImage(data.image[0]);
        if (uploadedUrl) {
          photoURL = uploadedUrl;
        }
      }

      // Update Firebase Profile
      await updateUserProfile(data.name, photoURL);

      // Sync Database
      await axiosSecure.post("/users/sync", {
        name: data.name,
        photoURL: photoURL,
        email: user?.email,
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile updated",
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: "bangla-text",
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Update failed",
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          title: "bangla-text",
        },
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
  

    <div className="max-w-7xl mx-auto px-4">
      <Helmet>
        <title>My Profile | Digital Life Lessons</title>
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <UserAvatar
                user={user}
                size="sm"
                className="w-32 h-32 text-3xl"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {user?.displayName}
            </h2>

            <p className="text-sm text-gray-500 mt-1 break-all">
              {user?.email}
            </p>

            {dbUser?.isPremium && (
              <span className="mt-3 px-4 py-1 text-sm font-bold text-yellow-700 bg-yellow-100 rounded-full flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                Premium
              </span>
            )}

            <span className="mt-2 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              {dbUser?.role === "admin" ? "Admin" : "User"}
            </span>

            <div className="w-full border-t mt-6 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Public Lessons</span>
                <span className="font-bold">{myLessons.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Saved Lessons</span>
                <span className="font-bold">{dbUser?.totalFavorites || 0}</span>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="lg:col-span-3 space-y-8">
          {/* EDIT PANEL */}
          {isEditing && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">
                Update Profile Information
              </h3>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: true })}
                    className="mt-2 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    {...register("image")}
                    className="mt-2 w-full border rounded-xl file:px-4 file:py-2 file:bg-primary-50 file:text-primary-700 file:rounded-full"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LESSONS SECTION */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              My Public Lessons
            </h2>

            {myLessons.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myLessons.map((lesson) => (
                  <LessonCard key={lesson._id} lesson={lesson} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                <p className="text-gray-500">
                  You haven’t published any public lessons yet.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
