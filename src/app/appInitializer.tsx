"use client";

// import localFont from "next/font/local";
import "./globals.scss";
import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/store";
import { userService } from "@/services/user.service";
import { authAction } from "@/redux";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/_commons/Loader";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    dispatch(authAction.loadTokenFromStorage());

    const fetchUser = async () => {
      try {
        const profile = await userService.getProfile();
        dispatch(authAction.setUser(profile));
      } catch (error) {
        dispatch(authAction.logout());
      }
    };

    if (token) {
      setLoading(true);
      fetchUser();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [dispatch, token]);
  return (
    <div>
      {loading ? (
        <div className="w-[100vw] h-[100vh] bg-white flex items-center justify-center">
          <Loader size="xl" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export const AppInitializerWithProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
};

export default AppInitializerWithProvider;
