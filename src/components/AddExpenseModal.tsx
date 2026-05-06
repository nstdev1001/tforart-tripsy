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
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/auth";
import { useAddExpense } from "../hooks/useExpense";
import { useIsMobile } from "../hooks/useIsMobile";
import { useVndExchangeRate } from "../hooks/useVndExchangeRate";
import { expenseSchema, type ExpenseFormValues } from "../schemas";
import { currencyOptions } from "../schemas/tripSchema";
import { exchangeRateService } from "../services";
import type { Participant } from "../types/trip";
import {
  formatSuggestedAmount,
  getAmountSuggestions,
} from "../utils/expenseAmountSuggestions";

interface AddExpenseModalProps {
  opened: boolean;
  onClose: () => void;
  tripId: string;
  participants: Participant[];
  secondaryCurrency?: string;
}

const VND_CURRENCY = "VND";

export const AddExpenseModal = ({
  opened,
  onClose,
  tripId,
  participants,
  secondaryCurrency,
}: AddExpenseModalProps) => {
  const inputNumberRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();
  const addExpense = useAddExpense();
  const isMobile = useIsMobile();

  const [hideSuggestionsForAmount, setHideSuggestionsForAmount] = useState<
    number | null
  >(null);

  const currentUserParticipant = participants.find(
    (p) => p.userId === user?.uid,
  );

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: undefined,
      currency: secondaryCurrency || VND_CURRENCY,
      description: "",
      paidBy: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedAmount = form.watch("amount");
  const watchedCurrency = form.watch("currency") || VND_CURRENCY;
  const { vndRate: exchangeRate } = useVndExchangeRate(watchedCurrency);
  const showExchangeRate = Boolean(
    secondaryCurrency &&
    watchedCurrency === secondaryCurrency &&
    watchedCurrency !== VND_CURRENCY,
  );

  const formatVndRate = (value: number) =>
    `${new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;

  const expenseCurrencyOptions = useMemo(() => {
    const normalizeOption = (value: string) =>
      currencyOptions.find((option) => option.value === value) || {
        value,
        label: value,
      };

    const options = [normalizeOption(VND_CURRENCY)];

    if (secondaryCurrency && secondaryCurrency !== VND_CURRENCY) {
      options.push(normalizeOption(secondaryCurrency));
    }

    return options;
  }, [secondaryCurrency]);

  const amountSuggestions = useMemo(
    () => getAmountSuggestions(watchedAmount),
    [watchedAmount],
  );

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

  const onSubmit = async (data: ExpenseFormValues) => {
    const participant = participants.find((p) => p.userId === data.paidBy);
    const selectedCurrency = data.currency || VND_CURRENCY;

    try {
      let convertedAmount = data.amount;
      let originalAmount: number | undefined;
      let exchangeRate: number | undefined;

      if (selectedCurrency !== VND_CURRENCY) {
        const conversion = await exchangeRateService.convertCurrency(
          data.amount,
          selectedCurrency,
          VND_CURRENCY,
        );
        convertedAmount = Math.round(conversion.convertedAmount);
        originalAmount = data.amount;
        exchangeRate = conversion.exchangeRate;
      }

      await addExpense.mutateAsync({
        tripId,
        amount: convertedAmount,
        currency: selectedCurrency,
        originalAmount,
        exchangeRate,
        description: data.description,
        paidBy: data.paidBy,
        paidByName: participant?.name || "Unknown",
        addExpenseBy: user?.uid || "Unknown",
        addExpenseByName: user?.displayName || "Unknown",
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

  const participantOptions = useMemo(
    () =>
      participants.map((p) => ({
        value: p.userId,
        label: p.name,
      })),
    [participants],
  );

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
          {secondaryCurrency !== VND_CURRENCY && (
            <Controller
              name="currency"
              control={form.control}
              render={({ field, fieldState }) =>
                isMobile ? (
                  <NativeSelect
                    label="Tiền tệ"
                    data={expenseCurrencyOptions}
                    value={field.value}
                    onChange={(value) => field.onChange(value || VND_CURRENCY)}
                    error={fieldState.error?.message}
                    size="md"
                  />
                ) : (
                  <Select
                    label="Tiền tệ"
                    placeholder="Chọn tiền tệ"
                    data={expenseCurrencyOptions}
                    value={field.value}
                    onChange={(value) => field.onChange(value || VND_CURRENCY)}
                    error={fieldState.error?.message}
                    size="md"
                    radius="md"
                    allowDeselect={false}
                  />
                )
              }
            />
          )}

          <TextInput
            label="Nội dung chi tiêu"
            placeholder="Ví dụ: Ăn trưa, Vé tham quan..."
            {...form.register("description")}
            error={form.formState.errors.description?.message}
            size="md"
            radius="md"
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <NumberInput
                  {...field}
                  ref={inputNumberRef}
                  label="Số tiền"
                  placeholder="Nhập số tiền"
                  error={fieldState.error?.message}
                  size="md"
                  min={0}
                  step={1000}
                  thousandSeparator=","
                  suffix={` ${watchedCurrency}`}
                  radius="md"
                />

                {hideSuggestionsForAmount !== watchedAmount &&
                  amountSuggestions.length > 0 && (
                    <Group gap="xs" mt={-6}>
                      {amountSuggestions.map((suggestion) => (
                        <Badge
                          key={suggestion}
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
                            inputNumberRef.current?.blur();
                          }}
                        >
                          {formatSuggestedAmount(suggestion)}
                        </Badge>
                      ))}
                    </Group>
                  )}
              </>
            )}
          />

          <Controller
            name="paidBy"
            control={form.control}
            render={({ field, fieldState }) =>
              isMobile ? (
                <NativeSelect
                  {...field}
                  label="Người chi tiêu"
                  data={[...participantOptions]}
                  error={fieldState.error?.message}
                  size="md"
                  radius="md"
                />
              ) : (
                <Select
                  {...field}
                  label="Người chi tiêu"
                  data={participantOptions}
                  error={fieldState.error?.message}
                  size="md"
                  radius="md"
                />
              )
            }
          />

          <Group justify="space-between" mt="md">
            {showExchangeRate ? (
              <Text size="sm" c="dimmed">
                Tỉ giá:{" "}
                {exchangeRate ? formatVndRate(exchangeRate) : "Loading..."}
              </Text>
            ) : (
              <Text aria-hidden style={{ visibility: "hidden" }}>
                Tỉ giá: {formatVndRate(0)}
              </Text>
            )}

            <div className="flex gap-2">
              <Button variant="light" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" loading={addExpense.isPending}>
                Thêm chi tiêu
              </Button>
            </div>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
