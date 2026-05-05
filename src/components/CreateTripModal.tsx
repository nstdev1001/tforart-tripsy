import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  NativeSelect,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/auth";
import { useIsMobile } from "../hooks/useIsMobile";
import { useCreateTrip } from "../hooks/useTrips";
import {
  tripCategoryOptions,
  tripSchema,
  type TripFormValues,
} from "../schemas";
import { currencyOptions } from "../schemas/tripSchema";
import type { TripCategory } from "../types/trip";
import { CategoryBadge } from "./CategoryBadge";

interface CreateTripModalProps {
  opened: boolean;
  onClose: () => void;
}

export const CreateTripModal = ({ opened, onClose }: CreateTripModalProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const createTrip = useCreateTrip();

  const form = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: "",
      category: "Du lịch",
      currency: "VND",
      startDate: new Date(),
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (opened) {
      form.reset({
        name: "",
        category: "Du lịch",
        currency: "VND",
        startDate: new Date(),
      });
    }
  }, [opened, form]);

  const onSubmit = async (data: TripFormValues) => {
    if (!user?.uid) return;

    try {
      await createTrip.mutateAsync({
        name: data.name,
        category: data.category,
        currency: data.currency,
        startDate: data.startDate,
        creator: user.uid,
        creatorName: user.displayName || undefined,
        creatorPhoto: user.photoURL || undefined,
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error creating trip:", error);
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
      title={
        <Text fw={600} size="lg">
          Tạo hoạt động mới
        </Text>
      }
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
                  radius="md"
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

          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) =>
              isMobile ? (
                <NativeSelect
                  label="Tiền tệ phụ"
                  description="VNĐ luôn là tiền chính"
                  data={currencyOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(value || "")}
                  error={fieldState.error?.message}
                  size="md"
                />
              ) : (
                <Select
                  label="Tiền tệ phụ"
                  placeholder="Chọn tiền tệ phụ"
                  description="VNĐ luôn là tiền chính"
                  data={currencyOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(value || "")}
                  error={fieldState.error?.message}
                  size="md"
                  radius="md"
                  searchable
                  allowDeselect={false}
                />
              )
            }
          />

          <TextInput
            label="Tên hoạt động"
            placeholder="Ví dụ: Du lịch Đà Nẵng 2026"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            size="md"
            radius="md"
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
                  radius="md"
                  locale="vi"
                  minDate={new Date()}
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
            <Button type="submit" loading={createTrip.isPending}>
              Tạo hoạt động
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
