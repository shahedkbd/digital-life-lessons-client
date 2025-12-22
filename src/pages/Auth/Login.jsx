import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, PenTool, BookOpen, Gem } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import Logo from "../../components/ui/Logo";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser: login, googleLogin: loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const validatePassword = (value) => {
    if (value.length < 6) {
      return "Length must be at least 6 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Must have an Uppercase letter in the password";
    }
    if (!/[a-z]/.test(value)) {
      return "Must have a Lowercase letter in the password";
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error.message || "Invalid email or password",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Google Login Successful",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Google Login Failed",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    //   <Helmet>
    //     <title>Login | Digital Life Lessons</title>
    //   </Helmet>
    //   <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    //     {/* Left Side - Illustration/Info */}
    //     <div className="hidden lg:block">
    //       <div className="text-center lg:text-left">
    //         <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
    //           Welcome Back!
    //         </h1>
    //         <p className="text-xl text-gray-600 mb-8 leading-relaxed">
    //           Write down your life lessons and share them with others. Every
    //           experience is valuable.
    //         </p>
    //         <div className="space-y-4">
    //           <div className="flex items-center gap-3">
    //             <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
    //               <PenTool className="text-white w-6 h-6" />
    //             </div>
    //             <p className="text-gray-700">Write down your experiences</p>
    //           </div>
    //           <div className="flex items-center gap-3">
    //             <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0">
    //               <BookOpen className="text-white w-6 h-6" />
    //             </div>
    //             <p className="text-gray-700">Get inspired by others' lessons</p>
    //           </div>
    //           <div className="flex items-center gap-3">
    //             <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
    //               <Gem className="text-white w-6 h-6" />
    //             </div>
    //             <p className="text-gray-700">Access premium content</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Right Side - Login Form */}
    //     <div className="w-full">
    //       <div className="bg-white rounded-4xl shadow-2xl p-8 sm:p-10">
    //         <div className="text-center mb-8">
    //           <Logo />
    //           <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
    //           <p className="text-gray-600">Access your account</p>
    //         </div>

    //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    //           {/* Email */}
    //           <div>
    //             <label className="block text-sm font-semibold text-gray-700 mb-2">
    //               Email
    //             </label>
    //             <div className="relative">
    //               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    //               <input
    //                 type="email"
    //                 {...register("email", {
    //                   required: "Email is required",
    //                   pattern: {
    //                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    //                     message: "Please enter a valid email",
    //                   },
    //                 })}
    //                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
    //                 placeholder="Your email"
    //               />
    //             </div>
    //             {errors.email && (
    //               <p className="mt-1 text-sm text-red-600">
    //                 {errors.email.message}
    //               </p>
    //             )}
    //           </div>

    //           {/* Password */}
    //           <div>
    //             <label className="block text-sm font-semibold text-gray-700 mb-2">
    //               Password
    //             </label>
    //             <div className="relative">
    //               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    //               <input
    //                 type={showPassword ? "text" : "password"}
    //                 {...register("password", {
    //                   required: "Password is required",
    //                   validate: validatePassword,
    //                 })}
    //                 className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
    //                 placeholder="Your password"
    //               />
    //               <button
    //                 type="button"
    //                 onClick={() => setShowPassword(!showPassword)}
    //                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //               >
    //                 {showPassword ? (
    //                   <EyeOff className="w-5 h-5" />
    //                 ) : (
    //                   <Eye className="w-5 h-5" />
    //                 )}
    //               </button>
    //             </div>
    //             {errors.password && (
    //               <p className="mt-1 text-sm text-red-600">
    //                 {errors.password.message}
    //               </p>
    //             )}
    //           </div>

    //           {/* Submit Button */}
    //           <button
    //             type="submit"
    //             className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
    //           >
    //             Login
    //           </button>
    //         </form>

    //         {/* Divider */}
    //         <div className="relative my-6">
    //           <div className="absolute inset-0 flex items-center">
    //             <div className="w-full border-t border-gray-300"></div>
    //           </div>
    //           <div className="relative flex justify-center text-sm">
    //             <span className="px-4 bg-white text-gray-500">Or</span>
    //           </div>
    //         </div>

    //         {/* Google Login */}
    //         <button
    //           type="button"
    //           onClick={handleGoogleLogin}
    //           className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
    //         >
    //           <FcGoogle className="w-6 h-6" />
    //           Login with Google
    //         </button>

    //         {/* Register Link */}
    //         <p className="mt-6 text-center text-gray-600">
    //           Don't have an account?{" "}
    //           <Link
    //             to="/register"
    //             className="text-primary-600 font-semibold hover:text-primary-700"
    //           >
    //             Register
    //           </Link>
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Login | Digital Life Lessons</title>
      </Helmet>

      {/* Centered Login Form */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-4xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Please enter your email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Please enter your password",
                    validate: validatePassword,
                  })}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            <FcGoogle className="w-6 h-6" />
            Login with Google
          </button>

          {/* Register Link */}
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
