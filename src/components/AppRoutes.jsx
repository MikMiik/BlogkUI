import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import AppLayout from "../layouts/AppLayout/AppLayout";
import FullscreenLayout from "../layouts/FullscreenLayout/FullscreenLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Loading from "./Loading/Loading";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import { lazyLoad } from "@/utils/lazyLoad";

// import { ProtectedRoute } from ".";

// Lazy load pages for better performance
// const Home = lazy(() => import("../pages/Home/Home"));
const Home = lazyLoad("../pages/Home/Home");
const Topic = lazyLoad("../pages/Topic/Topic");
const TopicsListing = lazyLoad("../pages/TopicsListing/TopicsListing");
const BlogDetail = lazyLoad("../pages/BlogDetail/BlogDetail");
const VerifiedEmail = lazyLoad("../pages/VerifiedEmail/VerifiedEmail");
const Profile = lazyLoad("../pages/Profile/Profile");
const EditProfile = lazyLoad("../pages/EditProfile/EditProfile");
const MyPosts = lazyLoad("../pages/MyPosts/MyPosts");
const WritePost = lazyLoad("../pages/WritePost/WritePost");
const Bookmarks = lazyLoad("../pages/Bookmarks/Bookmarks");
const DirectMessages = lazyLoad("../pages/DirectMessages/DirectMessages");
const Settings = lazyLoad("../pages/Settings/Settings");
const Login = lazyLoad("../pages/Login/Login");
const Register = lazyLoad("../pages/Register/Register");
const ForgotPassword = lazyLoad("../pages/ForgotPassword/ForgotPassword");
const ResetPassword = lazyLoad("../pages/ResetPassword/ResetPassword");
const NotFound = lazyLoad("../pages/NotFound/NotFound");

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading fullscreen />}>
        <Routes>
          {/* App Layout Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="verified" element={<VerifiedEmail />}></Route>
            <Route path="topics" element={<TopicsListing />} />
            <Route path="topics/:slug" element={<Topic />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="profile/:username/edit" element={<EditProfile />} />
            <Route path="my-posts" element={<MyPosts />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fullscreen Layout Routes */}
          <Route path="/" element={<FullscreenLayout />}>
            <Route path="write" element={<WritePost />} />
            <Route path="write/:slug" element={<WritePost />} />
            <Route path="messages" element={<DirectMessages />} />
          </Route>

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
