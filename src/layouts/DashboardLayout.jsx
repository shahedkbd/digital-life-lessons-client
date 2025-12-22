import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  RxDashboard,
  RxPerson,
  RxFileText,
  RxHeart,
  RxPlus,
  RxExit,
  RxHamburgerMenu,
  RxCross1,
} from "react-icons/rx";
import { FiUsers, FiSettings, FiAlertCircle } from "react-icons/fi";
import { MdOutlineAdminPanelSettings, MdClass } from "react-icons/md";
import UserAvatar from "../components/ui/UserAvatar";
import Logo from "../components/ui/Logo";

const DashboardLayout = () => {
  const { user, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if user is admin based on role from AuthContext
  const isAdmin = role === "admin";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navLinkStyles = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
                    fixed lg:static inset-y-0 left-0 z-50 flex-shrink-0
                    w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out 
                    ${
                      isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
                `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <Logo />
            <button
              onClick={closeSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <RxCross1 size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {isAdmin ? (
              <>
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Admin
                </p>
                <NavLink
                  to="/dashboard/admin"
                  end
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <MdOutlineAdminPanelSettings size={20} />
                  <span>Admin Home</span>
                </NavLink>
                <NavLink
                  to="/dashboard/my-lessons"
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <RxFileText size={20} />
                  <span>My Lessons</span>
                </NavLink>
                <NavLink
                  to="/dashboard/admin/manage-users"
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <FiUsers size={20} />
                  <span>Manage Users</span>
                </NavLink>
                <NavLink
                  to="/dashboard/admin/manage-lessons"
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <MdClass size={20} />
                  <span>Manage Lessons</span>
                </NavLink>
                <NavLink
                  to="/dashboard/admin/reported-lessons"
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <FiAlertCircle size={20} />
                  <span>Reported Lessons</span>
                </NavLink>
              </>
            ) : (
              <>
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Menu
                </p>
                <NavLink
                  to="/dashboard"
                  end
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <RxDashboard size={20} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/dashboard/my-lessons"
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <RxFileText size={20} />
                  <span>My Lessons</span>
                </NavLink>
                <NavLink
                  to="/dashboard/add-lesson"
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <RxPlus size={20} />
                  <span>Add Lesson</span>
                </NavLink>
                <NavLink
                  to="/dashboard/my-favorites"
                  onClick={closeSidebar}
                  className={navLinkStyles}
                >
                  <RxHeart size={20} />
                  <span>My Favorites</span>
                </NavLink>
              </>
            )}

            <div className="pt-6 mt-6 border-t border-gray-100">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Account
              </p>
              <NavLink
                to="/dashboard/profile"
                onClick={closeSidebar}
                className={navLinkStyles}
              >
                <RxPerson size={20} />
                <span>Profile</span>
              </NavLink>
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
              >
                <RxExit size={20} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>

          {/* User Info Footer */}
          {user && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            <RxHamburgerMenu size={24} />
          </button>
          <span className="font-semibold text-gray-900">Dashboard</span>
          <div className="w-6"></div> {/* Spacer for center alignment */}
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-gray-50/50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
