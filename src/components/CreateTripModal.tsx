import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../hooks/auth";
import { useCreateTrip } from "../hooks/useTrips";
import { tripSchema } from "../schemas/tripSchema";

type CreateTripForm = z.infer<typeof tripSchema>;

interface CreateTripModalProps {
  opened: boolean;
  onClose: () => void;
}

export const CreateTripModal = ({ opened, onClose }: CreateTripModalProps) => {
  const { user } = useAuth();
  const createTrip = useCreateTrip();

  const form = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
    },
    mode: "onChange",
  });

  // Reset form khi modal mở
  useEffect(() => {
    if (opened) {
      form.reset({
        name: "",
        startDate: new Date(),
      });
    }
  }, [opened, form]);

  const onSubmit = async (data: CreateTripForm) => {
    if (!user?.uid) return;

    try {
      await createTrip.mutateAsync({
        name: data.name,
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
      title="Tạo chuyến đi mới"
      centered
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Tên chuyến đi"
            placeholder="Ví dụ: Du lịch Đà Nẵng 2024"
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
              Tạo chuyến đi
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
