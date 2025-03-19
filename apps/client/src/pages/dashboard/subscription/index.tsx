import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@reactive-resume/ui";
import { t } from "@lingui/macro";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { SubscriptionCard } from "./_components/subscription-card";

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

  const { data: plans = [], isLoading: isPlansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const response = await axios.get<SubscriptionPlan[]>("/api/subscription/plans");
      return response.data;
    },
    retry: 1,
  });

  const { data: activeSubscription, isLoading: isSubscriptionLoading } = useQuery<Subscription | null>({
    queryKey: ["active-subscription"],
    queryFn: async () => {
      const response = await axios.get<Subscription | null>("/api/subscription/active");
      return response.data;
    },
    retry: 1,
  });

  const handleCancelSubscription = (subscriptionId: string) => {
    if (subscriptionId) {
      void cancelSubscription.mutate(subscriptionId);
    }
  };

  const cancelSubscription = useMutation({
    mutationFn: (subscriptionId: string) => 
      axios.patch(`/api/subscription/${subscriptionId}/cancel`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["active-subscription"] });
    },
  });

  if (isPlansLoading || isSubscriptionLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-full max-w-md space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  // Получаем данные для отображения
  const planName = activeSubscription?.plan?.name ?? "";
  const subscriptionStatus = activeSubscription?.status ?? "";
  const endDate = activeSubscription?.endDate 
    ? new Date(activeSubscription.endDate).toLocaleDateString()
    : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t`Subscription`}</h1>
      </div>

      {activeSubscription && activeSubscription.status === "active" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t`Active Subscription`}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{t`Plan: ${planName}`}</p>
            <p className="mb-2">{t`Status: ${subscriptionStatus}`}</p>
            <p className="mb-4">{t`Expires on: ${endDate}`}</p>
            
            <Button 
              variant="error"
              disabled={cancelSubscription.isPending}
              onClick={() => {
                handleCancelSubscription(activeSubscription.id);
              }}
            >
              {cancelSubscription.isPending ? t`Canceling...` : t`Cancel Subscription`}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(plans) && plans.map((plan) => (
          <SubscriptionCard 
            key={plan.id}
            plan={plan} 
            isActive={activeSubscription?.plan?.id === plan.id && activeSubscription.status === "active"}
          />
        ))}
      </div>
    </div>
  );
}; 