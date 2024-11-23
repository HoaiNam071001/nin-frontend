import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const useAuth = () => {
  const { isAuthenticated, token, user } = useSelector(
    (state: RootState) => state.auth
  );
  return { isAuthenticated, token, currentUser: user };
};

export default useAuth;
