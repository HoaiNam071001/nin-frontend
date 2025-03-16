import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { User, UserPayload } from "@/models";
import { NFile, SystemFileType, UploadFilePayload } from "@/models/file.model";
import { fileService } from "@/services/file.service";
import FormInput from "@/components/Form/FormInput";
import CustomImage from "@/components/_commons/CustomImage";
import FileUpload from "@/components/_commons/FileUpload";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { userService } from "@/services/user/user.service";
import { useDispatch } from "react-redux";
import { authAction } from "@/redux";
import useAuth from "@/hooks/useAuth";
import { toastService } from "@/services/toast.service";
import SvgIcon from "@/components/_commons/SvgIcon";
import NButton from "@/components/_commons/NButton";
import I18n from "@/components/_commons/I18n";
import { formatDate } from "@/helpers/date";
import { DATE_FORMATS } from "@/constants";

export const UserSetting = ({ userId }) => {
  const [user, setUser] = useState<User>();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const { handleSubmit, control, setValue, getValues, watch } =
    useForm<UserPayload>({
      defaultValues: {},
    });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const _user = await userService.getUserById(userId);
        setUser(_user);
        onSetForm(_user);
      } catch (error: any) {
        toastService.error(error?.message || "500 Error");
      }
    };

    fetchUser();
  }, [userId]);

  const onSubmit = async (data: UserPayload) => {
    try {
      const payload: UserPayload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        phoneNumber: data.phoneNumber,
        birthDay: data.birthDay
          ? formatDate({
              date: data.birthDay,
              format: DATE_FORMATS.DATE_FORMAT,
              inputFormat: DATE_FORMATS.FULL_DATE_NO_TIME,
            })
          : null,
        bio: data.bio,
      };
      const updatedUser = await userService.updateUser(userId, payload);
      toastService.success("Updated successfully");
      if (currentUser.id === user.id) {
        dispatch(authAction.setUser(updatedUser));
      }
      setUser(updatedUser);
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  const onSetForm = (user: User) => {
    Object.entries(user).forEach(([key, value]) => {
      if (key in getValues()) {
        setValue(key as keyof UserPayload, value);
      }
    });
  };

  const onCancel = () => {
    onSetForm(user);
  };

  return (
    <>
      <div className="px-5 py-3 border border-stroke shadow-lg rounded-lg h-[80vh] overflow-auto">
        <div className="text-title-md font-semibold">
          <I18n i18key={"User Setting"} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="col-span-12 md:col-span-4">
            <Thumbnail control={control} setValue={setValue} />
          </div>
          <div className="col-span-12 md:col-span-8 p-4">
            <div className="form-group">
              <label htmlFor="overview-name">Email</label>
              <FormInput name={`email`} control={control} disabled={true} />
            </div>
            <div className="form-group">
              <label htmlFor="overview-name">First Name</label>
              <FormInput
                name={`firstName`}
                control={control}
                defaultValue={""}
                rules={{
                  required: "Name is required",
                }}
                placeholder="Enter the first name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="overview-name">Last Name</label>
              <FormInput
                name={`lastName`}
                control={control}
                defaultValue={""}
                rules={{
                  required: "Name is required",
                }}
                placeholder="Enter the last name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="overview-summary">Bio</label>
              <FormInput
                name={`bio`}
                control={control}
                defaultValue={""}
                placeholder="Enter Bio"
              />
            </div>
            <div className="form-group">
              <label htmlFor="overview-summary">Phone Number</label>
              <FormInput
                name={`phoneNumber`}
                control={control}
                type="number"
                placeholder="Enter Phone Number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="overview-summary">Birth Day</label>
              <FormInput
                name={`birthDay`}
                control={control}
                defaultValue={""}
                type="date"
                placeholder="Enter Bio"
              />
            </div>

            <div>
              <div className="flex justify-end gap-4 mt-5">
                <NButton variant="outlined" onClick={onCancel}>
                  <I18n i18key={"Cancel"} />
                </NButton>

                <NButton onClick={handleSubmit(onSubmit)}>
                  <I18n i18key={"Save"} />
                </NButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Thumbnail = ({ control, setValue }) => {
  const uploadFile = async (file: File) => {
    const payload: UploadFilePayload = {
      file: file,
      type: SystemFileType.PROFILE,
    };
    const fileRes: NFile = await fileService.upload(payload);
    setValue("avatar", fileRes.url);
  };

  return (
    <div className="flex justify-center items-center h-[250px]">
      <div className="relative group rounded-full overflow-hidden">
        <div className="absolute w-full h-full invisible group-hover:visible hover:bg-slate-600 hover:bg-opacity-20 flex items-center justify-center">
          <FileUpload label={"Thumbnail"} upload={uploadFile}>
            <NButton
              variant="filled"
              color="black"
              tooltip="Change avatar"
              size="xxl-circle"
              shape="full"
            >
              <SvgIcon className="icon icon-xxl" icon="camera" />
            </NButton>
          </FileUpload>
        </div>

        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <CustomImage
              src={field.value || DEFAULT_COURSE_THUMBNAIL}
              alt="preview"
              className="w-[200px] h-[200px] "
            />
          )}
        />
      </div>
    </div>
  );
};
