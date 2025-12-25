import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddParticipant } from "../hooks/useTrips";

const participantSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
});

type ParticipantForm = z.infer<typeof participantSchema>;

interface AddParticipantModalProps {
  opened: boolean;
  onClose: () => void;
  tripId: string;
}

export const AddParticipantModal = ({
  opened,
  onClose,
  tripId,
}: AddParticipantModalProps) => {
  const addParticipant = useAddParticipant();

  const form = useForm<ParticipantForm>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ParticipantForm) => {
    try {
      await addParticipant.mutateAsync({
        tripId,
        participant: {
          name: data.name,
        },
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error adding participant:", error);
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
      title="Thêm thành viên"
      centered
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Tên thành viên"
            placeholder="Nhập tên thành viên"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            size="md"
            radius="md"
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" loading={addParticipant.isPending}>
              Thêm thành viên
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
