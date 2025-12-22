import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PublicLessons from "../pages/Lessons/PublicLessons";
import LessonDetails from "../pages/Lessons/LessonDetails";
import Pricing from "../pages/Pricing/Pricing";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentCancel from "../pages/Payment/PaymentCancel";
import NotFound from "../pages/Error/NotFound";
import AuthorProfile from "../pages/Lessons/AuthorProfile";

// User Dashboard Pages
import DashboardHome from "../pages/Dashboard/DashboardHome";
import AddLesson from "../pages/Dashboard/AddLesson";
import MyLessons from "../pages/Dashboard/MyLessons";
import UpdateLesson from "../pages/Dashboard/UpdateLesson";
import MyFavorites from "../pages/Dashboard/MyFavorites";
import Profile from "../pages/Dashboard/Profile";

// Admin Pages
import AdminHome from "../pages/Dashboard/AdminHome";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ManageLessons from "../pages/Dashboard/ManageLessons";
import ReportedLessons from "../pages/Dashboard/ReportedLessons";

// Routes Protection
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "public-lessons",
        element: <PublicLessons />,
      },
      {
        path: "lesson/:id",
        element: (
          <PrivateRoute>
            <LessonDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "author/:id",
        element: <AuthorProfile />,
      },
      {
        path: "pricing",
        element: (
          <PrivateRoute>
            <Pricing />
          </PrivateRoute>
        ),
      },
      {
        path: "payment/success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "payment/cancel",
        element: (
          <PrivateRoute>
            <PaymentCancel />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      // User Routes
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "add-lesson",
        element: <AddLesson />,
      },
      {
        path: "my-lessons",
        element: <MyLessons />,
      },
      {
        path: "update-lesson/:id",
        element: <UpdateLesson />,
      },
      {
        path: "my-favorites",
        element: <MyFavorites />,
      },
      {
        path: "profile",
        element: <Profile />,
      },

      // Admin Routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-lessons",
        element: (
          <AdminRoute>
            <ManageLessons />
          </AdminRoute>
        ),
      },
      {
        path: "admin/reported-lessons",
        element: (
          <AdminRoute>
            <ReportedLessons />
          </AdminRoute>
        ),
      },
      {
        path: "admin/profile",
        element: (
          <AdminRoute>
            <Profile />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
