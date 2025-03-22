import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reactive-resume/ui";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: Record<string, boolean>;
};

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
};

// Схема валидации для платежной формы
const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: t`Card number must be at least 16 digits` })
    .max(19),
  cardholderName: z.string().min(3, { message: t`Cardholder name is required` }),
  expiryMonth: z.string().min(1, { message: t`Expiry month is required` }),
  expiryYear: z.string().min(1, { message: t`Expiry year is required` }),
  cvc: z
    .string()
    .min(3, { message: t`CVC is required` })
    .max(4),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const PaymentModal = ({ isOpen, onClose, plan }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    },
  });

  // Создание подписки
  const createSubscription = useMutation({
    mutationFn: async () => {
      // Сначала создаем подписку
      const subscriptionResponse = await axios.post("/api/subscription", {
        planId: plan.id,
        duration: plan.duration // передаем длительность
      });

      // Затем создаем платеж
      const paymentResponse = await axios.post("/api/payment/create-intent", {
        amount: plan.price, // общая стоимость с учетом длительности
        currency: plan.currency,
        description: `Subscription: ${subscriptionResponse.data.id}`,
        subscriptionId: subscriptionResponse.data.id,
      });

      return {
        subscription: subscriptionResponse.data,
        payment: paymentResponse.data,
      };
    },
    onSuccess: () => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Закрываем модальное окно через 2 секунды после успешной оплаты
      setTimeout(() => {
        onClose();
        // Перезагружаем страницу для обновления статуса подписки
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      setIsProcessing(false);
      // Здесь можно добавить вывод ошибки пользователю
    },
  });

  // Обработка отправки формы
  const onSubmit = () => {
    setIsProcessing(true);
    // В реальном проекте здесь будет валидация и обработка данных карты
    // через Stripe или другой платежный сервис
    createSubscription.mutate();
  };

  // Форматирование общей стоимости для отображения
  const formattedTotalPrice = new Intl.NumberFormat(undefined, {
    style: "currency", 
    currency: plan.currency,
  }).format(plan.price);

  // Если это подписка на несколько месяцев, вычисляем и отображаем цену за месяц
  const monthlyPrice = plan.duration > 1 ? plan.price / plan.duration : plan.price;
  const formattedMonthlyPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: plan.currency,
  }).format(monthlyPrice);

  // Период подписки для отображения
  const getPeriodText = () => {
    if (plan.duration === 1) return t`месяц`;
    if (plan.duration === 3) return t`квартал`;
    if (plan.duration === 12) return t`год`;
    return t`${plan.duration} месяцев`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t`Подписка на ${plan.name}`}</DialogTitle>
          <DialogDescription>
            {plan.duration > 1 ? (
              <>
                <div>{t`Ежемесячно: ${formattedMonthlyPrice}`}</div>
                <div className="mt-1 font-semibold">{t`Всего за ${getPeriodText()}: ${formattedTotalPrice}`}</div>
              </>
            ) : (
              <>{t`Стоимость: ${formattedTotalPrice} в месяц`}</>
            )}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-4 rounded-full bg-success/20 p-3">
              <svg
                className="size-6 text-success"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-center text-xl font-semibold">{t`Оплата успешна!`}</p>
            <p className="text-muted-foreground text-center text-sm">{t`Ваша подписка активирована.`}</p>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Номер карты`}</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" disabled={isProcessing} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Имя держателя карты`}</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванов Иван" disabled={isProcessing} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t`Месяц`}</FormLabel>
                      <Select
                        defaultValue={field.value}
                        disabled={isProcessing}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t`Месяц`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0");
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t`Год`}</FormLabel>
                      <Select
                        defaultValue={field.value}
                        disabled={isProcessing}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t`Год`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i).toString();
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvc"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t`CVC`}</FormLabel>
                      <FormControl>
                        <Input placeholder="123" maxLength={4} disabled={isProcessing} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" disabled={isProcessing} onClick={onClose}>
                  {t`Отмена`}
                </Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? t`Обработка...` : t`Оплатить`}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
