import { t } from "@lingui/macro";
import { Card, CardContent, CardHeader } from "@reactive-resume/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { PlanCard } from "../../../../components/pricing/plan-card";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: Record<string, boolean>;
};

export const PricingSection = () => {
  const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const response = await axios.get<SubscriptionPlan[]>("/api/subscription/plans");
      return response.data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">{t`Pricing`}</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              {t`Choose the plan that's right for you`}
            </p>
          </div>
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

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">{t`Pricing`}</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            {t`Choose the plan that's right for you`}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isActive={false} />
          ))}
        </div>
      </div>
    </section>
  );
};
