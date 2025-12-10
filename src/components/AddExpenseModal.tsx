import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../hooks/auth";
import type { Participant } from "../types/trip";
import { useAddExpense } from "../hooks/useExpense";

const expenseSchema = z.object({
  amount: z.number().min(1000, "Số tiền phải lớn hơn 1,000đ"),
  description: z.string().min(1, "Nội dung không được để trống"),
  paidBy: z.string().min(1, "Vui lòng chọn người chi tiêu"),
});

type ExpenseForm = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  opened: boolean;
  onClose: () => void;
  tripId: string;
  participants: Participant[];
}

export const AddExpenseModal = ({
  opened,
  onClose,
  tripId,
  participants,
}: AddExpenseModalProps) => {
  const { user } = useAuth();
  const addExpense = useAddExpense();

  // Tìm participant tương ứng với user hiện tại
  const currentUserParticipant = participants.find(
    (p) => p.userId === user?.uid
  );

  const form = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      description: "",
      paidBy: "",
    },
  });

  // Set default paidBy khi modal mở và có user
  useEffect(() => {
    if (opened && currentUserParticipant) {
      form.setValue("paidBy", currentUserParticipant.userId);
    }
  }, [opened, currentUserParticipant, form]);

  const onSubmit = async (data: ExpenseForm) => {
    const participant = participants.find((p) => p.userId === data.paidBy);

    try {
      await addExpense.mutateAsync({
        tripId,
        amount: data.amount,
        description: data.description,
        paidBy: data.paidBy,
        paidByName: participant?.name || "Unknown",
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const participantOptions = participants.map((p) => ({
    value: p.userId,
    label: p.name,
  }));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Thêm chi tiêu"
      centered
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                label="Số tiền"
                placeholder="Nhập số tiền"
                error={fieldState.error?.message}
                size="md"
                min={0}
                step={1000}
                thousandSeparator=","
                suffix=" đ"
              />
            )}
          />

          <TextInput
            label="Nội dung chi tiêu"
            placeholder="Ví dụ: Ăn trưa, Vé tham quan..."
            {...form.register("description")}
            error={form.formState.errors.description?.message}
            size="md"
          />

          <Controller
            name="paidBy"
            control={form.control}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Người chi tiêu"
                placeholder="Chọn người chi tiêu"
                data={participantOptions}
                error={fieldState.error?.message}
                size="md"
                searchable
              />
            )}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" loading={addExpense.isPending}>
              Thêm chi tiêu
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
