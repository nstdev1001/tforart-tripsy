import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  NativeSelect,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CategoryBadge } from "./CategoryBadge";
import { useIsMobile } from "../hooks/useIsMobile";
import { useUpdateTrip } from "../hooks/useTrips";
import {
  tripCategoryOptions,
  tripSchema,
  type TripFormValues,
} from "../schemas";
import type { Trip, TripCategory } from "../types/trip";

interface EditTripModalProps {
  opened: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export const EditTripModal = ({
  opened,
  onClose,
  trip,
}: EditTripModalProps) => {
  const isMobile = useIsMobile();
  const updateTrip = useUpdateTrip();

  const form = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: "",
      category: "Du lịch",
      startDate: new Date(),
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (trip && opened) {
      form.reset({
        name: trip.name,
        category: trip.category || "Du lịch",
        startDate: new Date(trip.startDate),
      });
    }
  }, [trip, opened, form]);

  const onSubmit = async (data: TripFormValues) => {
    if (!trip?.id) return;

    try {
      await updateTrip.mutateAsync({
        tripId: trip.id,
        updates: {
          name: data.name,
          category: data.category,
          startDate: data.startDate,
        },
      });
      onClose();
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Chỉnh sửa hoạt động"
      centered
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) =>
              isMobile ? (
                <NativeSelect
                  label="Phân loại"
                  data={tripCategoryOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(value || "")}
                  error={fieldState.error?.message}
                  size="md"
                />
              ) : (
                <Select
                  label="Phân loại"
                  placeholder="Chọn phân loại"
                  data={tripCategoryOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(value || "")}
                  error={fieldState.error?.message}
                  size="md"
                  allowDeselect={false}
                  leftSection={
                    <CategoryBadge
                      category={(field.value as TripCategory) || "Du lịch"}
                      size="sm"
                    />
                  }
                  leftSectionWidth={110}
                  leftSectionPointerEvents="none"
                  styles={{
                    input: { color: "transparent", caretColor: "transparent" },
                  }}
                  renderOption={({ option }) => (
                    <CategoryBadge
                      category={option.value as TripCategory}
                      size="sm"
                    />
                  )}
                />
              )
            }
          />

          <TextInput
            label="Tên hoạt động"
            placeholder="Nhập tên hoạt động"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            size="md"
          />

          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => {
              const dateValue =
                field.value instanceof Date
                  ? field.value
                  : new Date(field.value as Date);

              return (
                <DateInput
                  value={dateValue}
                  onChange={(value) => {
                    const newDate = value || new Date();
                    field.onChange(newDate);
                  }}
                  onBlur={field.onBlur}
                  label="Ngày bắt đầu"
                  placeholder="Chọn ngày bắt đầu"
                  error={fieldState.error?.message}
                  size="md"
                  locale="vi"
                  clearable={false}
                  valueFormat="DD/MM/YYYY"
                />
              );
            }}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" loading={updateTrip.isPending}>
              Lưu thay đổi
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
