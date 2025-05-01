"use client";

import FormInput from "@/components/Form/FormInput";
import CustomImage from "@/components/_commons/CustomImage";
import { I18nLink } from "@/components/_commons/I18nLink";
import Loader from "@/components/_commons/Loader";
import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import { ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { authAction } from "@/redux";
import { authService } from "@/services/auth.service";
import { toastService } from "@/services/toast.service";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

const SignUp: React.FC = () => {
  const { handleSubmit, control, watch } = useForm<SignupFormValues>({
    mode: "onTouched",
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>();
  const router = useI18nRouter();

  const onSubmit = () => {
    handleSubmit((data) => signup(data))();
  };

  const signup = async (data) => {
    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...res } = data;
      const response = await authService.signup({
        ...res,
      });
      setLoading(false);
      toastService.success("Tạo thành công");
      dispatch(authAction.login(response));
      router.push(ROUTES.HOME);
    } catch (error) {
      toastService.error(error?.message || "500 Error");
      setLoading(false);
    }
  };
  const password = watch("password");

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
              Sign Up
            </h2>

            <div className="flex space-x-4">
              <div className="form-group w-1/2">
                <label htmlFor="overview-name">First name</label>
                <FormInput
                  name={`firstName`}
                  control={control}
                  defaultValue={""}
                  rules={{
                    required: "First name is required",
                  }}
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group w-1/2">
                <label htmlFor="overview-name">Last name</label>
                <FormInput
                  name={`lastName`}
                  control={control}
                  defaultValue={""}
                  rules={{
                    required: "Last name is required",
                  }}
                  placeholder="Enter last name"
                />
              </div>
            </div>

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
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message:
                      "Password must be at least 6 characters and include both letters and numbers",
                  },
                }}
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="overview-name">Password</label>
              <FormInput
                name={`confirmPassword`}
                control={control}
                defaultValue={""}
                type="password"
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                placeholder="Enter confirm password"
              />
            </div>

            <div className="mt-[40px] space-y-7">
              <NButton
                variant="solid"
                color="primary"
                size="xl"
                disabled={loading}
                onClick={onSubmit}
                className="w-full"
              >
                <div className="flex items-center justify-center space-x-2">
                  {loading && <Loader color="white" size="sm" />}
                  <span>Sign Up</span>
                </div>
              </NButton>

              {/* <NButton
                variant="outlined"
                color="primary"
                size="lg"
                onClick={onSubmit}
                className="w-full flex justify-center items-center gap-3"
              >
                <SvgIcon icon="google"></SvgIcon>
                Sign up with Google
              </NButton> */}
            </div>

            <div className="mt-6 text-center space-x-2">
              <span>Already have an account?</span>
              <I18nLink href={ROUTES.SIGN_IN} className="text-system">
                Sign in
              </I18nLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
