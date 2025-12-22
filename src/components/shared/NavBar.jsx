import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogOut, User, LayoutDashboard, Star } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useUserPlan from "../../hooks/useUserPlan";
import UserAvatar from "../ui/UserAvatar";
import Logo from "../ui/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logoutUser: logout } = useAuth();
  const { isPremium, role } = useUserPlan();

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/public-lessons", label: "Public Lessons" },
  ];

  if (user) {
    navLinks.push({ path: "/dashboard/add-lesson", label: "Add Lesson" });
    navLinks.push({ path: "/dashboard/my-lessons", label: "My Lessons" });
    if (!isPremium) {
      navLinks.push({ path: "/pricing", label: "Upgrade" });
    } else {
      navLinks.push({ path: "/pricing", label: "Pricing" });
    }
  }

  const NavLinkItem = ({ to, children, mobile = false }) => (
    <NavLink
      to={to}
      onClick={() => mobile && setIsOpen(false)}
      className={({ isActive }) =>
        `font-medium transition-colors ${mobile
          ? `block px-4 py-3 rounded-lg ${isActive
            ? "bg-primary-100 text-primary-700"
            : "text-gray-700 hover:bg-gray-100"
          }`
          : `${isActive
            ? "text-primary-600"
            : "text-gray-700 hover:text-primary-600"
          }`
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="bg-white/80 shadow-md sticky backdrop-blur top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLinkItem key={link.path} to={link.path}>
                {link.label}
              </NavLinkItem>
            ))}

            
          </div>

          {/* Right Side - Auth */}
          <div className="hidden md:flex items-center gap-4">

            {/* Premium Badge */}
            {user && isPremium && (
              <button className="flex items-center gap-3 cursor-pointer text-white font-semibold bg-gradient-to-r from-gray-800 to-black px-3 py-1.5 rounded-full border border-gray-600 hover:scale-105 duration-200 hover:text-gray-500 hover:border-gray-800 hover:from-black hover:to-gray-900">
                <Star className="w-4 h-4" />
                Premium
              </button>
            )}
            {/* {user && isPremium && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full text-sm font-semibold premium-glow">
                <Star className="w-4 h-4" />
                Premium
              </span>
            )} */}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <UserAvatar user={user} size="md" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {isPremium && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            <Star className="w-3 h-3" />
                            Premium Member
                          </span>
                        )}
                      </div>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-600" />
                        Profile
                      </Link>

                      <Link
                        to={
                          role === "admin" ? "/dashboard/admin" : "/dashboard"
                        }
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-600" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavLinkItem key={link.path} to={link.path} mobile>
                {link.label}
              </NavLinkItem>
            ))}

            {user && isPremium && (
              <div className="px-4 py-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4" />
                  Premium
                </span>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 mt-4">
              {user ? (
                <>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <UserAvatar user={user} size="md" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/dashboard/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    Profile
                  </Link>

                  <Link
                    to={role === "admin" ? "/dashboard/admin" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-600" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-red-600 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center text-primary-600 font-semibold hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
//     <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="grid grid-cols-3 items-center ">
      
//       {/* Left: Logo */}
//       <div className="flex items-center">
//         <Logo />
//       </div>

//       {/* Center: Desktop Navigation */}
//       <div className="hidden md:flex justify-center items-center gap-6">
//         {navLinks.map((link) => (
//           <NavLinkItem key={link.path} to={link.path}>
//             {link.label}
//           </NavLinkItem>
//         ))}
//       </div>

//       {/* Right: Auth / Profile */}
//       <div className="hidden md:flex justify-end items-center gap-4">
//         {user ? (
//           <div className="relative flex items-center gap-3">
            
//             {isPremium && (
//               <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
//                 <Star className="w-3.5 h-3.5" />
//                 Pro
//               </span>
//             )}

//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className="hover:opacity-80 transition-opacity"
//             >
//               <UserAvatar user={user} size="md" />
//             </button>

//             {showDropdown && (
//               <>
//                 <div
//                   className="fixed inset-0 z-10"
//                   onClick={() => setShowDropdown(false)}
//                 />
//                 <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
//                   <div className="px-4 py-3 border-b border-gray-100">
//                     <p className="font-semibold text-gray-900">
//                       {user.displayName || "User"}
//                     </p>
//                     <p className="text-sm text-gray-500">{user.email}</p>
//                   </div>

//                   <Link
//                     to="/dashboard/profile"
//                     onClick={() => setShowDropdown(false)}
//                     className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"
//                   >
//                     <User className="w-4 h-4 text-gray-600" />
//                     Profile
//                   </Link>

//                   <Link
//                     to={role === "admin" ? "/dashboard/admin" : "/dashboard"}
//                     onClick={() => setShowDropdown(false)}
//                     className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50"
//                   >
//                     <LayoutDashboard className="w-4 h-4 text-gray-600" />
//                     Dashboard
//                   </Link>

//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 w-full text-left"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     Logout
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ) : (
//           <div className="flex items-center gap-3">
//             <Link
//               to="/login"
//               className="text-sm font-semibold text-gray-700 hover:text-primary-600"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="px-5 py-2 bg-primary-600 text-white rounded-full text-sm font-semibold hover:bg-primary-700"
//             >
//               Get Started
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="md:hidden justify-self-end p-2 rounded-lg hover:bg-gray-100"
//       >
//         {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//       </button>
//     </div>
//   </div>

//   {/* Mobile Menu */}
//   {isOpen && (
//     <div className="md:hidden bg-white border-t border-gray-100">
//       <div className="px-4 py-5 space-y-3">
//         {navLinks.map((link) => (
//           <NavLinkItem key={link.path} to={link.path} mobile>
//             {link.label}
//           </NavLinkItem>
//         ))}

//         <div className="pt-4 border-t border-gray-100">
//           {user ? (
//             <>
//               <Link
//                 to="/dashboard"
//                 onClick={() => setIsOpen(false)}
//                 className="block px-4 py-3 rounded-lg hover:bg-gray-50"
//               >
//                 Dashboard
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 onClick={() => setIsOpen(false)}
//                 className="block px-4 py-3 text-center rounded-lg hover:bg-gray-50"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 onClick={() => setIsOpen(false)}
//                 className="block px-4 py-3 text-center bg-primary-600 text-white rounded-lg"
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )}
// </nav>

  );
};

export default Navbar;
