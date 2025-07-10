import { Navigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.currentUser);
  if (!currentUser) {
    const path = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?continue=${path}`} />;
  }

  return children;
}

export default ProtectedRoute;
