import { getCurrentUser } from "@/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserProvider() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch, navigate]);

  return null;
}
export default UserProvider;
