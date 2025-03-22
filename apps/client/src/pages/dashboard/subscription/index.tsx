import { t } from "@lingui/macro";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@reactive-resume/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import { PricingSection } from "../../home/sections/pricing";
import { PaymentModal } from "./_components/payment-modal";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: Record<string, boolean>;
};

type Subscription = {
  id: string;
  status: string;
  endDate: string;
  plan?: SubscriptionPlan;
};

export const SubscriptionPage = () => {
  const queryClient = useQueryClient();
  const [selectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: activeSubscription, isLoading: isSubscriptionLoading } =
    useQuery<Subscription | null>({
      queryKey: ["active-subscription"],
      queryFn: async () => {
        const response = await axios.get<Subscription | null>("/api/subscription/active");
        return response.data;
      },
      retry: 1,
    });

  const handleCancelSubscription = (subscriptionId: string) => {
    if (subscriptionId) {
      cancelSubscription.mutate(subscriptionId);
    }
  };

  const cancelSubscription = useMutation({
    mutationFn: (subscriptionId: string) =>
      axios.patch(`/api/subscription/${subscriptionId}/cancel`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["active-subscription"] });
    },
  });

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  if (isSubscriptionLoading) {
    return (
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">{t`Подписка`}</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              {t`Выберите подходящий план`}
            </p>
          </div>

          {/* Скелетон для карточек планов */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="h-48" />
                <CardContent className="space-y-4">
                  <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const formattedEndDate = activeSubscription?.endDate
    ? new Date(activeSubscription.endDate).toLocaleDateString()
    : "";

  return (
    <>
      <Helmet>
        <title>
          {t`Subscription`} - {t`Reactive Resume`}
        </title>
      </Helmet>
      <div className="max-w-2xl space-y-4">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          {t`Subscription`}
        </motion.h1>
      </div>
      {activeSubscription && activeSubscription.status === "active" && (
        <div className="mx-auto max-w-4xl px-6 pt-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">{t`Подписка`}</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              {t`Ваша активная подписка`}
            </p>
          </div>

          <Card className="mt-8 border-primary">
            <CardHeader>
              <CardTitle>{t`Активная подписка`}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight">
                  {activeSubscription.plan?.price} {activeSubscription.plan?.currency}
                </span>
                <span className="text-base text-gray-500">/{t`месяц`}</span>
              </div>
              <p className="mt-6 text-base leading-7 text-gray-500">
                {activeSubscription.plan?.description}
              </p>
              <p className="mt-4 text-base leading-7">{t`Истекает: ${formattedEndDate}`}</p>

              <div className="mt-10">
                <Button
                  variant="error"
                  disabled={cancelSubscription.isPending}
                  onClick={() => {
                    handleCancelSubscription(activeSubscription.id);
                  }}
                >
                  {cancelSubscription.isPending ? t`Отменяется...` : t`Отменить подписку`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Используем компонент PricingSection с домашней страницы */}
      <PricingSection />

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
        />
      )}
    </>
  );
};
