"use client";

import React, { useState } from "react";
import CustomImage from "@/components/_commons/CustomImage";
import SvgIcon from "@/components/_commons/SvgIcon";
import { useForm } from "react-hook-form";
import FormInput from "@/components/Form/FormInput";
import NButton from "@/components/_commons/NButton";
import { authService } from "@/services/auth.service";
import { toastService } from "@/services/toast.service";
import { useDispatch } from "react-redux";
import Loader from "@/components/_commons/Loader";
import { authAction } from "@/redux";
import { ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { I18nLink } from "@/components/_commons/I18nLink";

interface SigninFormValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { handleSubmit, control } = useForm<SigninFormValues>({
    mode: "onBlur",
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>();
  const router = useI18nRouter();

  const onSubmit = () => {
    handleSubmit((data) => signin(data))();
  };

  const signin = async (data) => {
    try {
      setLoading(true);
      const response = await authService.signin({
        email: data.email,
        password: data.password,
      });
      setLoading(false);
      dispatch(authAction.login(response));
      router.push(ROUTES.HOME);
    } catch (error) {
      toastService.error(error?.message || "500 Error");
      setLoading(false);
    }
  };

  const newLocal = "mt-[40px] space-y-7";
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="flex flex-wrap">
        <div className="hidden w-full xl:flex xl:w-1/2 p-5 flex-col">
          <div className="my-auto">
            <SvgIcon icon="sign-in"></SvgIcon>
          </div>
        </div>

        <div className="w-full border-stroke xl:w-1/2 xl:border-l-2 flex min-h-[100vh]">
          <div className="w-full pt-10 p-[20px] max-w-[600px] mx-auto">
            <I18nLink className="mb-5 inline-block" href={ROUTES.HOME}>
              <CustomImage src="/images/logo-full.png" alt="Logo" width={150} />
            </I18nLink>
            <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
              Sign In
            </h2>

            <div className="form-group">
              <label htmlFor="overview-name">Email</label>
              <FormInput
                name={`email`}
                control={control}
                defaultValue={""}
                type="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="overview-name">Password</label>
              <FormInput
                name={`password`}
                control={control}
                defaultValue={""}
                type="password"
                rules={{
                  required: "Password is required",
                }}
                placeholder="Enter password"
              />
            </div>

            <div className={newLocal}>
              <NButton
                variant="solid"
                color="primary"
                size="xl"
                onClick={onSubmit}
                className="w-full"
                disabled={loading}
              >
                <div className="flex items-center justify-center space-x-2">
                  {loading && <Loader color="white" size="sm" />}
                  <span>Sign In</span>
                </div>
              </NButton>

              <NButton
                variant="outlined"
                color="primary"
                size="lg"
                onClick={onSubmit}
                className="w-full flex justify-center items-center gap-3"
              >
                <SvgIcon icon="google"></SvgIcon>
                Sign in with Google
              </NButton>
            </div>

            <div className="mt-6 text-center space-x-2">
              <span>Don&apos;t have any account?</span>
              <I18nLink href={ROUTES.SIGN_UP} className="text-system">
                Sign Up
              </I18nLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
