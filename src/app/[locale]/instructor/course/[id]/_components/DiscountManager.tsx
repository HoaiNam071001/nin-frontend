"use client";

import NDatePicker from "@/components/_commons/Datepicker";
import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import NTable, { TableColumn } from "@/components/_commons/NTable";
import SvgIcon from "@/components/_commons/SvgIcon";
import FormInput from "@/components/Form/FormInput";
import FormSelection from "@/components/Form/FormSelection";
import { DATE_FORMATS } from "@/constants";
import {
  Discount,
  DiscountPayload,
  DiscountType,
  SettingSubmitProps,
} from "@/models";
import { useModal } from "@/providers/ModalProvider";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const DiscountManager: React.FC<SettingSubmitProps> = ({
  course,
  editable,
}) => {
  const { openModal } = useModal();

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, [course]);

  const fetchDiscounts = async () => {
    try {
      const fetchedDiscounts = await courseService.getDiscountsByCourseId(
        course.id
      );
      setDiscounts(fetchedDiscounts);
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  const handleCreateOrUpdateDiscount = async (data: DiscountPayload) => {
    try {
      data.amount = +(data.amount || 0);
      if (editingDiscount) {
        await courseService.updateDiscount(editingDiscount.id, data);
        toastService.success("Discount updated successfully");
      } else {
        await courseService.createDiscount(course.id, data);
        toastService.success("Discount created successfully");
      }
      fetchDiscounts();
      setEditingDiscount(null);
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    try {
      await courseService.deleteDiscount(id);
      fetchDiscounts();
      toastService.success("Discount deleted successfully");
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    openModal({
      content: (
        <DiscountForm
          discountPayload={{
            ...discount,
            startDate: moment(discount.startDate).toISOString(),
            endDate: moment(discount.endDate).toISOString(),
          }}
          onSubmit={handleCreateOrUpdateDiscount}
          isEditing={true}
        />
      ),
      header: <I18n i18key={"Edit Discount"} />,
      onClose: () => setEditingDiscount(null),
      config: { width: "600px" },
    });
  };

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    openModal({
      content: (
        <DiscountForm
          discountPayload={{
            courseId: course.id,
            discountType: DiscountType.PERCENT,
            startDate: moment().toISOString(),
            endDate: moment().add(1, "day").toISOString(),
          }}
          onSubmit={handleCreateOrUpdateDiscount}
          isEditing={false}
        />
      ),
      header: <I18n i18key={"Add Discount"} />,
      onClose: () => setEditingDiscount(null),
      config: { width: "600px" },
    });
  };

  const columns: TableColumn<Discount>[] = [
    {
      title: "Discount",
      dataIndex: "discountType",
      width: 100,
      render: (value, record) =>
        value === DiscountType.PERCENT
          ? `${record.amount}%`
          : `${record.amount}`,
    },
    {
      title: "Discount Code",
      dataIndex: "discountCode",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 150,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (value) => moment(value).format(DATE_FORMATS.SHORT_DATE_VERBOSE),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (value) => moment(value).format(DATE_FORMATS.SHORT_DATE_VERBOSE),
    },
    {
      title: "",
      render: (record) => (
        <div className="flex items-center justify-center gap-2">
          {editable && (
            <>
              <NButton
                size="sm"
                variant="filled"
                onClick={() => handleEditDiscount(record.id)}
              >
                <SvgIcon icon={"edit"} className="icon icon-sm" />
              </NButton>
              <NButton
                size="sm"
                variant="filled"
                color="red"
                onClick={() => handleDeleteDiscount(record)}
              >
                <SvgIcon icon={"remove"} className="icon icon-sm" />
              </NButton>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <div className="font-semibold mb-2">
        <I18n i18key={"Discounts"} />
      </div>
      <NTable<Discount> columns={columns} dataSource={discounts} />
      {editable && (
        <NButton onClick={handleAddDiscount}>Create Discount</NButton>
      )}
    </div>
  );
};

interface DiscountFormProps {
  discountPayload: DiscountPayload;
  onSubmit: (data: DiscountPayload) => void;
  isEditing: boolean;
}

const DiscountForm: React.FC<DiscountFormProps> = ({
  discountPayload,
  onSubmit,
  isEditing,
}) => {
  const { closeModal } = useModal();
  const { handleSubmit, setValue, control } = useForm<DiscountPayload>({
    defaultValues: discountPayload,
  });

  const handleFormSubmit = (data: DiscountPayload) => {
    onSubmit(data);
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="form-group space-y-2">
        <FormSelection
          control={control}
          bindLabel="label"
          bindValue="value"
          name={"discountType"}
          options={[
            { label: "Percent", value: DiscountType.PERCENT },
            { label: "Amount", value: DiscountType.AMOUNT },
          ]}
        ></FormSelection>

        <FormInput
          name={`amount`}
          type="number"
          control={control}
          defaultValue={""}
          rules={{
            required: "Value is required",
            min: 0,
          }}
          placeholder="Enter value"
        />
      </div>

      <div className="flex">
        <div className="form-group flex-1">
          <label>
            <I18n i18key={"Start Date"} />
          </label>
          <NDatePicker
            value={discountPayload.startDate}
            onChange={(value) => setValue("startDate", value)}
          />
        </div>
        <div className="form-group flex-1">
          <label>
            <I18n i18key={"End Date"} />
          </label>
          <NDatePicker
            value={discountPayload.endDate}
            onChange={(value) => setValue("endDate", value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <I18n i18key={"Discount Code"} />
        </label>
        <FormInput
          name={`discountCode`}
          control={control}
          rules={{ required: "Value is required" }}
          defaultValue={""}
          placeholder="Enter value"
        />
      </div>
      <div className="form-group">
        <label>
          <I18n i18key={"Description"} />
        </label>
        <FormInput
          name={`description`}
          control={control}
          defaultValue={""}
          placeholder="Enter value"
        />
      </div>
      <div className="flex justify-end gap-2">
        <NButton variant="outlined" onClick={closeModal}>
          Cancel
        </NButton>
        <NButton>{isEditing ? "Update" : "Create"}</NButton>
      </div>
    </form>
  );
};
