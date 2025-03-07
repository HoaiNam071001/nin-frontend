"use client";

import NDatePicker from "@/components/_commons/Datepicker";
import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import NInput from "@/components/_commons/NInput";
import NSelection from "@/components/_commons/NSelection";
import NTable, { TableColumn } from "@/components/_commons/NTable";
import {
  Course,
  CoursePayload,
  Discount,
  DiscountPayload,
  DiscountType,
  SettingSubmitProps,
} from "@/models";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { SectionOptions } from "./SectionOptions";

export const DiscountManager: React.FC<SettingSubmitProps> = ({ course }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [discountPayload, setDiscountPayload] = useState<DiscountPayload>({
    courseId: course.id,
    discountType: DiscountType.PERCENT,
    startDate: moment().toISOString(),
    endDate: moment().add(1, "day").toISOString(),
  });

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

  const handleCreateOrUpdateDiscount = async () => {
    try {
      if (editingDiscount) {
        await courseService.updateDiscount(editingDiscount.id, discountPayload);
        toastService.success("Discount updated successfully");
      } else {
        await courseService.createDiscount(course.id, discountPayload);
        toastService.success("Discount created successfully");
      }
      fetchDiscounts();
      setEditingDiscount(null);
      setDiscountPayload({
        courseId: course.id,
        discountType: DiscountType.PERCENT,
        startDate: moment().toISOString(),
        endDate: moment().add(1, "day").toISOString(),
      });
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
    setDiscountPayload({
      ...discount,
      startDate: moment(discount.startDate).toISOString(),
      endDate: moment(discount.endDate).toISOString(),
    });
  };

  const columns: TableColumn<Discount>[] = [
    {
      title: "Discount",
      dataIndex: "discountType",
      render: (value, record) =>
        value === DiscountType.PERCENT
          ? `${record.discountPercentage}%`
          : `${record.discountAmount}`,
    },
    {
      title: "Discount Code",
      dataIndex: "discountCode",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
      title: "",
      render: (record) => (
        <div className="flex justify-end">
          <SectionOptions
            deleteMessage="Are you sure to delete this Discount?"
            onRemove={() => handleDeleteDiscount(record.id)}
            onEdit={() => handleEditDiscount(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="font-semibold mb-2">
        <I18n i18key={"Discounts"} />
      </div>
      <NTable<Discount> columns={columns} dataSource={discounts} />

      <DiscountForm
        discountPayload={discountPayload}
        setDiscountPayload={setDiscountPayload}
        onSubmit={handleCreateOrUpdateDiscount}
        isEditing={!!editingDiscount}
      />
    </>
  );
};

interface DiscountFormProps {
  discountPayload: DiscountPayload;
  setDiscountPayload: (payload: DiscountPayload) => void;
  onSubmit: () => void;
  isEditing: boolean;
}

const DiscountForm: React.FC<DiscountFormProps> = ({
  discountPayload,
  setDiscountPayload,
  onSubmit,
  isEditing,
}) => {
  return (
    <div className="border border-stroke p-4 rounded-lg shadow-lg bg-slate-50">
      <div className="form-group">
        <NSelection<{ label: string; value: string }>
          value={discountPayload.discountType}
          bindLabel="label"
          bindValue="value"
          options={[
            { label: "Percent", value: DiscountType.PERCENT },
            { label: "Amount", value: DiscountType.AMOUNT },
          ]}
          onChange={(value) => {
            setDiscountPayload({
              ...discountPayload,
              discountType: value as any,
            });
          }}
        />
        {discountPayload.discountType === "percent" ? (
          <>
            <label>
              <I18n i18key={"Discount Percentage"} />{" "}
            </label>
            <NInput
              type="number"
              value={discountPayload.discountPercentage}
              onValueChange={(value) =>
                setDiscountPayload({
                  ...discountPayload,
                  discountPercentage: value as number,
                })
              }
            />
          </>
        ) : (
          <>
            <label>
              <I18n i18key={"Discount Amount"} />
            </label>
            <NInput
              type="number"
              value={discountPayload.discountAmount}
              onValueChange={(value) =>
                setDiscountPayload({
                  ...discountPayload,
                  discountAmount: value as number,
                })
              }
            />
          </>
        )}
      </div>

      <div className="flex">
        <div className="form-group flex-1">
          <label>
            <I18n i18key={"Start Date"} />
          </label>
          <NDatePicker
            value={discountPayload.startDate}
            onChange={(value) =>
              setDiscountPayload({
                ...discountPayload,
                startDate: value as string,
              })
            }
          />
        </div>
        <div className="form-group flex-1">
          <label>
            <I18n i18key={"End Date"} />
          </label>
          <NDatePicker
            value={discountPayload.endDate}
            onChange={(value) =>
              setDiscountPayload({
                ...discountPayload,
                endDate: value as string,
              })
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <I18n i18key={"Discount Code"} />
        </label>
        <NInput
          value={discountPayload.discountCode}
          onValueChange={(value) =>
            setDiscountPayload({
              ...discountPayload,
              discountCode: value as string,
            })
          }
        />
      </div>
      <div className="form-group">
        <label>
          <I18n i18key={"Description"} />
        </label>
        <NInput
          value={discountPayload.description}
          onValueChange={(value) =>
            setDiscountPayload({
              ...discountPayload,
              description: value as string,
            })
          }
        />
      </div>
      <NButton onClick={onSubmit}>
        {isEditing ? "Update Discount" : "Create Discount"}
      </NButton>
    </div>
  );
};

export default DiscountForm;
