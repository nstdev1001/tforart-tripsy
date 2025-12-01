import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateTrip } from "../hooks/useTrips";
import { tripSchema } from "../schemas/tripSchema";
import type { Trip } from "../types/trip";

type EditTripForm = z.infer<typeof tripSchema>;

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
  const updateTrip = useUpdateTrip();

  const form = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (trip && opened) {
      form.reset({
        name: trip.name,
        startDate: new Date(trip.startDate),
      });
    }
  }, [trip, opened, form]);

  const onSubmit = async (data: EditTripForm) => {
    if (!trip?.id) return;

    try {
      await updateTrip.mutateAsync({
        tripId: trip.id,
        updates: {
          name: data.name,
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
      title="Chỉnh sửa chuyến đi"
      centered
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Tên chuyến đi"
            placeholder="Nhập tên chuyến đi"
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
