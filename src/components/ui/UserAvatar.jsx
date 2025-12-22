import React from "react";
import { User } from "lucide-react";

const UserAvatar = ({ user, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  if (user?.photoURL || user?.image) {
    return (
      <img
        src={user?.photoURL || user?.image}
        alt={user?.displayName || "User"}
        referrerPolicy="no-referrer"
        className={`${currentSize} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
      />
    );
  }

  if (user?.displayName) {
    const initials = user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        className={`${currentSize} rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold border-2 border-white shadow-sm ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`${currentSize} rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-2 border-white shadow-sm ${className}`}
    >
      <User className="w-1/2 h-1/2" />
    </div>
  );
};

export default UserAvatar;
