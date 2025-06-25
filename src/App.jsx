import { Outlet, useNavigate } from "react-router-dom";
import { SideNavbar } from "./Components/Shared/SideNavbar";
import { useEffect } from "react";
import { setNavigationCallback } from "./Utils/axiosInstance";
import ScrollToTop from "./Utils/ScrollToTop";

export const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback(navigate);

    return () => {
      setNavigationCallback(null);
    };
  }, [navigate]);
  return (
    <>
      <SideNavbar />
      <ScrollToTop />
      <Outlet />
    </>
  );
};
