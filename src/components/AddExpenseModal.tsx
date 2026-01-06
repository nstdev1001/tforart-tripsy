import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Group,
  Modal,
  NativeSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../hooks/auth";
import { useAddExpense } from "../hooks/useExpense";
import type { Participant } from "../types/trip";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [hideSuggestionsForAmount, setHideSuggestionsForAmount] = useState<
    number | null
  >(null);

  const currentUserParticipant = participants.find(
    (p) => p.userId === user?.uid
  );

  const form = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: undefined,
      description: "",
      paidBy: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedAmount = form.watch("amount");

  const amountSuggestions = useMemo(() => {
    if (typeof watchedAmount !== "number" || Number.isNaN(watchedAmount)) {
      return [] as number[];
    }

    if (!Number.isInteger(watchedAmount)) {
      return [] as number[];
    }

    if (watchedAmount <= 0 || watchedAmount >= 10000) {
      return [] as number[];
    }

    const absolute = Math.abs(watchedAmount);
    const digits = absolute === 0 ? 1 : Math.floor(Math.log10(absolute)) + 1;
    const startPower = Math.max(0, 5 - digits);

    return [0, 1, 2].map((i) => watchedAmount * 10 ** (startPower + i));
  }, [watchedAmount]);

  const formatSuggestedAmount = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  useEffect(() => {
    if (opened && currentUserParticipant) {
      form.setValue("paidBy", currentUserParticipant.userId);
    }
  }, [opened, currentUserParticipant, form]);

  useEffect(() => {
    if (!opened) return;
    setHideSuggestionsForAmount(null);
  }, [opened]);

  useEffect(() => {
    if (hideSuggestionsForAmount === null) return;
    if (typeof watchedAmount !== "number") {
      setHideSuggestionsForAmount(null);
      return;
    }
    if (watchedAmount !== hideSuggestionsForAmount) {
      setHideSuggestionsForAmount(null);
    }
  }, [watchedAmount, hideSuggestionsForAmount]);

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
    setHideSuggestionsForAmount(null);
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
      title={
        <Text fw={600} size="lg">
          Thêm chi tiêu
        </Text>
      }
      centered
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
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
                  radius="md"
                />

                {hideSuggestionsForAmount !== watchedAmount &&
                  amountSuggestions.length > 0 && (
                    <Group gap="xs" mt={-6}>
                      {amountSuggestions.map((suggestion) => (
                        <Fragment key={suggestion}>
                          <Badge
                            variant="light"
                            size="lg"
                            style={{ cursor: "pointer" }}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              form.setValue("amount", suggestion, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                              setHideSuggestionsForAmount(suggestion);
                            }}
                          >
                            {formatSuggestedAmount(suggestion)}
                          </Badge>
                        </Fragment>
                      ))}
                    </Group>
                  )}
              </>
            )}
          />

          <TextInput
            label="Nội dung chi tiêu"
            placeholder="Ví dụ: Ăn trưa, Vé tham quan..."
            {...form.register("description")}
            error={form.formState.errors.description?.message}
            size="md"
            radius="md"
          />

          <Controller
            name="paidBy"
            control={form.control}
            render={({ field, fieldState }) =>
              isMobile ? (
                <NativeSelect
                  {...field}
                  label="Người chi tiêu"
                  data={[
                    { value: "", label: "Chọn người chi tiêu" },
                    ...participantOptions,
                  ]}
                  error={fieldState.error?.message}
                  size="md"
                  radius="md"
                />
              ) : (
                <Select
                  {...field}
                  label="Người chi tiêu"
                  placeholder="Chọn người chi tiêu"
                  data={participantOptions}
                  error={fieldState.error?.message}
                  size="md"
                  radius="md"
                />
              )
            }
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
