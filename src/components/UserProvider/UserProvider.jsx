import { getCurrentUser } from "@/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function UserProvider() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return null;
}
export default UserProvider;
