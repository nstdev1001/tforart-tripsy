import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../hooks/auth";
import { useCreateTrip } from "../hooks/useTrips";

const createTripSchema = z.object({
  name: z.string().min(1, "Tên chuyến đi không được để trống"),
  startDate: z
    .date({
      required_error: "Ngày bắt đầu không được để trống",
    })
    .min(new Date(), "Ngày bắt đầu phải từ hôm nay trở đi"),
});

type CreateTripForm = z.infer<typeof createTripSchema>;

interface CreateTripModalProps {
  opened: boolean;
  onClose: () => void;
}

export const CreateTripModal = ({ opened, onClose }: CreateTripModalProps) => {
  const { user } = useAuth();
  const createTrip = useCreateTrip();

  const form = useForm<CreateTripForm>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
    },
  });

  const onSubmit = async (data: CreateTripForm) => {
    if (!user?.uid) return;

    try {
      await createTrip.mutateAsync({
        name: data.name,
        startDate: data.startDate,
        creator: user.uid,
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Tạo chuyến đi mới" centered>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Tên chuyến đi"
            placeholder="Nhập tên chuyến đi"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
          />

          <DateInput
            label="Ngày bắt đầu"
            placeholder="Chọn ngày bắt đầu"
            value={form.watch("startDate")}
            onChange={(date) => form.setValue("startDate", date || new Date())}
            error={form.formState.errors.startDate?.message}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
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
