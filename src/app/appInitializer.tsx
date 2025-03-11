"use client";

// import localFont from "next/font/local";
import "./globals.scss";
import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/store";
import { userService } from "@/services/user/user.service";
import { authAction } from "@/redux";
import Loader from "@/components/_commons/Loader";
import { StorageKey } from "@/constants";
import { ModalProvider } from "@/providers/ModalProvider";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(StorageKey.AUTH_TOKEN);
    const fetchUser = async () => {
      try {
        const profile = await userService.getProfile();
        dispatch(authAction.setUser(profile));
        dispatch(authAction.setRole());
      } catch (error) {
        dispatch(authAction.logout());
      }
      setLoading(false);
    };

    if (token) {
      dispatch(authAction.loadTokenFromStorage());
      setLoading(true);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [dispatch]);

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
      <AppInitializer>
        <ModalProvider>{children}</ModalProvider>
      </AppInitializer>
    </Provider>
  );
};

export default AppInitializerWithProvider;
