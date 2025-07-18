// hooks/useCurrentUser.js
import { useSelector } from "react-redux";

export function useCurrentUser() {
  return useSelector((state) => state.auth.currentUser);
}
