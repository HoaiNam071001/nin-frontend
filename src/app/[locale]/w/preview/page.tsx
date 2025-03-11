"use client";

import CustomImage from "@/components/_commons/CustomImage";
import Loader from "@/components/_commons/Loader";
import NButton from "@/components/_commons/NButton";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Role, ROUTES } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { authAction } from "@/redux";
import { toastService } from "@/services/toast.service";
import { userService } from "@/services/user/user.service";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const CoursePreview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>();
  const dispatch = useDispatch();
  const router = useI18nRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (
      currentUser &&
      currentUser.roles?.some((e) => e.roleName === Role.TEACHER)
    ) {
      router.push(ROUTES.INSTRUCTOR);
    }
  }, [currentUser, router]);

  const onStart = async () => {
    try {
      setLoading(true);
      const response = await userService.addMyRole({
        role: Role.TEACHER,
      });
      dispatch(authAction.setUser(response));
      setLoading(false);
      router.push(ROUTES.INSTRUCTOR);
    } catch (error) {
      toastService.error(error?.message || "500 Error");
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="h-[80vh] rounded-md flex relative container mx-auto">
        <CustomImage
          height={500}
          width={500}
          className="h-full"
          src="/images/teacher.png"
          alt="instructor"
        ></CustomImage>
        <div className="absolute md:static left-0 top-0 p-5 flex h-full items-center">
          <div>
            <div className="text-title-xxl font-semibold">Teach with Us</div>
            <div>
              Do you have a passion for sharing knowledge? Join our teaching
              community and inspire learners worldwide!
            </div>
            <div>
              On our platform, you can create courses, easily manage your
              content, and connect with thousands of students from all over the
              globe.
            </div>
            <div>
              {`Whether you're an educator, a professional, or simply someone who loves to teach, we're here to support you every step of the way.`}
            </div>
            <div className="font-semibold">
              Start today and turn your passion into value for the community!
            </div>

            <div className="pt-7">
              <NButton
                size="xl"
                onClick={()=> onStart()}
                className="flex justify-center items-center gap-3"
              >
                <div className="flex items-center justify-center space-x-2">
                  {loading && <Loader color="white" size="sm" />}
                  <span> Get Started</span>
                </div>
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CoursePreview;
