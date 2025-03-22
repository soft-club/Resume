import { t } from "@lingui/macro";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@reactive-resume/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { PlanCard } from "../../../components/pricing/plan-card";
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
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: plans = [], isLoading: isPlansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const response = await axios.get<SubscriptionPlan[]>("/api/subscription/plans");
      return response.data;
    },
    retry: 1,
  });

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

  const handleOpenPaymentModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  if (isPlansLoading || isSubscriptionLoading) {
    return (
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">{t`Subscription`}</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              {t`Choose the plan that's right for you`}
            </p>
          </div>

          {/* Скелетон для активной подписки */}
          {activeSubscription && (
            <div className="mx-auto mt-16 max-w-4xl">
              <Skeleton className="h-48 w-full" />
            </div>
          )}

          {/* Скелетон для карточек планов */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">{t`Subscription`}</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            {t`Choose the plan that's right for you`}
          </p>
        </div>

        {activeSubscription && activeSubscription.status === "active" && (
          <div className="mx-auto mt-16 max-w-4xl">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>{t`Active Subscription`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight">
                    {activeSubscription.plan?.price} {activeSubscription.plan?.currency}
                  </span>
                  <span className="text-base text-gray-500">/{t`month`}</span>
                </div>
                <p className="mt-6 text-base leading-7 text-gray-500">
                  {activeSubscription.plan?.description}
                </p>
                <p className="mt-4 text-base leading-7">{t`Expires on: ${formattedEndDate}`}</p>

                <div className="mt-10">
                  <Button
                    variant="error"
                    disabled={cancelSubscription.isPending}
                    onClick={() => {
                      handleCancelSubscription(activeSubscription.id);
                    }}
                  >
                    {cancelSubscription.isPending ? t`Canceling...` : t`Cancel Subscription`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(plans) &&
            plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={
                  activeSubscription?.plan?.id === plan.id && activeSubscription.status === "active"
                }
                onSubscribe={handleOpenPaymentModal}
              />
            ))}
        </div>

        {selectedPlan && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            plan={selectedPlan}
            onClose={handleClosePaymentModal}
          />
        )}
      </div>
    </section>
  );
};
