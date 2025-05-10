"use client";

// import localFont from "next/font/local";
import Loader from "@/components/_commons/Loader";
import { ROUTES, StorageKey } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { ModalProvider } from "@/providers/ModalProvider";
import { authAction } from "@/redux";
import store from "@/redux/store";
import { userService } from "@/services/user/user.service";
import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import "./globals.scss";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useI18nRouter();

  const handleLogin = () => {
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
      router.push(ROUTES.HOME);
      fetchUser();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event) => {
      if (event.key === StorageKey.AUTH_TOKEN) {
        if (!event.newValue) {
          router.push(ROUTES.SIGN_IN);
          setLoading(false);
        } else {
          handleLogin();
        }
      }
    };

    handleLogin();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
