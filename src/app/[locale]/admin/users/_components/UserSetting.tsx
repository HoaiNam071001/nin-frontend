import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@/components/Form/FormInput";
import { userService } from "@/services/user/user.service";
import { useDispatch } from "react-redux";
import { authAction } from "@/redux";
import useAuth from "@/hooks/useAuth";
import { toastService } from "@/services/toast.service";
import NButton from "@/components/_commons/NButton";
import I18n from "@/components/_commons/I18n";
import { formatDate } from "@/helpers/date";
import { DATE_FORMATS, Role, RoleOptions } from "@/constants";
import { adminService } from "@/services/admin/admin.service";
import {
  CreateUserPayload,
  UpdateUserPayload,
} from "@/models/admin/admin.model";
import FormSelection from "@/components/Form/FormSelection";
import { DropdownOption } from "@/models/utils.model";
import RoleLabel from "./RoleLabel";
import { useModal } from "@/providers/ModalProvider";
import { User } from "@/models";

interface UserProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  birthDay?: string;
  bio?: string;
  password?: string;
  roles?: Role[];
}

export const UserSetting = ({
  userId,
  update,
  create,
}: {
  userId?: number;
  update?: (user: User) => void;
  create?: (user: User) => void;
}) => {
  const { closeModal } = useModal();

  const [user, setUser] = useState<User>();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const { handleSubmit, control, setValue, getValues } = useForm<UserProps>({
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
    if (!userId) {
      return;
    }
    fetchUser();
  }, [userId]);

  const onSubmit = async (data: UserProps) => {
    if (userId) {
      updateUser(data);
      return;
    }
    createUser(data);
  };

  const createUser = async (data: UserProps) => {
    try {
      const payload: CreateUserPayload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        birthDay: data.birthDay
          ? formatDate({
              date: data.birthDay,
              format: DATE_FORMATS.DATE_FORMAT,
              inputFormat: DATE_FORMATS.FULL_DATE_NO_TIME,
            })
          : null,
        bio: data.bio,
        password: data.password,
        roles: data.roles,
      };
      const updatedUser = await adminService.createUser(payload);
      toastService.success("Created successfully");
      create?.(updatedUser);
      closeModal();
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  const updateUser = async (data: UserProps) => {
    try {
      const payload: UpdateUserPayload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        birthDay: data.birthDay
          ? formatDate({
              date: data.birthDay,
              format: DATE_FORMATS.DATE_FORMAT,
              inputFormat: DATE_FORMATS.FULL_DATE_NO_TIME,
            })
          : null,
        bio: data.bio,
        roles: data.roles,
      };
      const updatedUser = await adminService.updateUser(userId, payload);
      toastService.success("Updated successfully");
      if (currentUser.id === user.id) {
        dispatch(authAction.setUser(updatedUser));
      }
      update?.(updatedUser);
      closeModal();
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  const onSetForm = (user: User) => {
    Object.entries(user).forEach(([key, value]) => {
      if (key !== "roles" && key in getValues()) {
        setValue(key as keyof UserProps, value);
      }
    });
    setValue(
      "roles",
      user.roles.map((e) => e.roleName)
    );
  };

  const onCancel = () => {
    closeModal();
  };

  const render = (item: DropdownOption<Role>) => {
    return (
      <div className="flex">
        <RoleLabel role={item.value} />
      </div>
    );
  };

  return (
    <>
      <div className="p-4">
        <div className="form-group">
          <label htmlFor="overview-name">Roles</label>
          <FormSelection
            control={control}
            name={"roles"}
            bindValue={"value"}
            renderLabel={render}
            renderOption={render}
            multiple={true}
            className="w-full"
            clearable={false}
            options={RoleOptions}
            placeholder="Select Role"
          ></FormSelection>
        </div>
        <div className="form-group">
          <label htmlFor="overview-name">Email</label>
          <FormInput name={`email`} control={control} />
        </div>
        <div className="flex gap-4">
          <div className="form-group w-1/2">
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
          <div className="form-group w-1/2">
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

        {!userId && (
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
        )}

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
    </>
  );
};

// const Thumbnail = ({ control, setValue, user }) => {
//   const uploadFile = async (file: File) => {
//     const payload: UploadFilePayload = {
//       file: file,
//       type: SystemFileType.PROFILE,
//     };
//     const fileRes: NFile = await fileService.upload(payload);
//     setValue("avatar", fileRes.url);
//   };

//   return (
//     <div className="flex justify-center items-center h-[250px]">
//       <div className="relative group rounded-full overflow-hidden">
//         <div className="absolute w-full h-full invisible group-hover:visible hover:bg-slate-600 hover:bg-opacity-20 flex items-center justify-center">
//           <FileUpload label={"Thumbnail"} upload={uploadFile}>
//             <NButton
//               variant="filled"
//               color="black"
//               tooltip="Change avatar"
//               size="xxl-circle"
//               shape="full"
//             >
//               <SvgIcon className="icon icon-xxl" icon="camera" />
//             </NButton>
//           </FileUpload>
//         </div>

//         <Controller
//           name="avatar"
//           control={control}
//           render={({ field }) => (
//             <NAvatar
//               src={field.value}
//               name={user?.fullName}
//               alt="preview"
//               size="xxl"
//             />
//           )}
//         />
//       </div>
//     </div>
//   );
// };
