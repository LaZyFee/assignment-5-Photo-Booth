import { NavLink, Link, useNavigate } from "react-router-dom";
import { HomeSvg } from "../SVGs/HomeSvg";
import { NotificationSvg } from "../SVGs/NotificationSvg";
import { PlusSvg } from "../SVGs/PlusSvg";
import { Profile2Svg } from "../SVGs/Profile2Svg";
import { Profilesvg } from "../SVGs/Profilesvg";
import logo2 from "/assets/logo-2.svg";
import { useAuth } from "../../Store/AuthStore";
import { useEffect } from "react";

const menuItems = [
  {
    name: "Home",
    to: "/",
    icon: <HomeSvg />,
  },
  {
    name: "Notifications",
    to: "/notification",
    icon: <NotificationSvg />,
  },
  {
    name: "Create",
    to: "/create-post",
    icon: <PlusSvg />,
  },
  {
    name: "Profile",
    to: "/profile",
    icon: <Profilesvg />,
  },
];

export const SideNavbar = () => {
  const { user, logout, initializeAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar)
      return "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg";
    return `http://localhost:3000/${avatar}`;
  };

  return (
    <aside className="hidden floating-navbar bg-white border px-6 py-2 md:flex flex-col">
      <Link to="/" className="flex gap-2 items-center font-medium py-4 mb-8">
        <img src={logo2} alt="PhotoBooth" className="h-6 object-contain" />
        <h2 className="text-lg">Photo Booth</h2>
      </Link>

      <ul className="space-y-8 flex-1">
        {menuItems.map(({ name, to, icon }) => (
          <li key={name}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-row items-center gap-2 ${
                  isActive
                    ? "bg-red-500 text-white text-md rounded-2xl py-2 px-3 font-semibold"
                    : "text-gray-600"
                }`
              }
            >
              {icon}
              <span>{name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {user ? (
        <div className="flex justify-between items-center">
          <Link to="/profile">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg";
                  }}
                />
              </div>
              <div className="ml-2">
                <span className="font-semibold text-sm">{user.name}</span>
                <p className="text-xs text-gray-500 leading-none">
                  @{user.name}
                </p>
              </div>
            </div>
          </Link>

          <button
            title="Logout"
            type="button"
            onClick={handleLogout}
            className="cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200 px-2 py-1 rounded-md"
          >
            <Profile2Svg />
          </button>
        </div>
      ) : (
        <div className="w-full py-4 px-2">
          <p className="text-gray-700 text-sm whitespace-nowrap">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      )}
    </aside>
  );
};
