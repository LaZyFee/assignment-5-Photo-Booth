import { createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { HomePage } from "../Pages/HomePage";
import { NotificationPage } from "../Pages/NotificationPage";
import { CreatePost } from "../Pages/CreatePost";
import { DetailsPost } from "../Components/HomePageComponent/DetailsPost";
import { ProfilePage } from "../Pages/ProfilePage";
import { EditProfile } from "../Pages/EditProfile";
import { Login } from "../Pages/Authentication/Login";
import { SignUp } from "../Pages/Authentication/SignUp";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "post-details/:id",
        element: <DetailsPost />,
      },
      {
        path: "/create-post",
        element: (
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/:id",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      },
      {
        path: "/notification",
        element: (
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
