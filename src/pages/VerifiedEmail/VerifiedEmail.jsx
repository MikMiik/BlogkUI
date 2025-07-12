import { getCurrentUser } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

function VerifiedEmail() {
  const params = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const token = params.get("token");
  if (token) {
    localStorage.setItem("token", token);
    dispatch(getCurrentUser());
    return <Navigate to={"/"} />;
  }
}

export default VerifiedEmail;
