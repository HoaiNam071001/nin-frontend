import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const useAuth = () => {
  const { isAuthenticated, token, user, activeRole } = useSelector(
    (state: RootState) => state.auth
  );
  return { isAuthenticated, token, currentUser: user, activeRole };
};

export default useAuth;
