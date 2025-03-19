import { t } from "@lingui/macro";
import { Card, CardContent, CardHeader, CardTitle } from "@reactive-resume/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="h-48" />
                <CardContent className="space-y-4">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight">
                    {plan.price} {plan.currency}
                  </span>
                  <span className="text-base text-muted-foreground">/{t`month`}</span>
                </div>
                <p className="mt-6 text-base leading-7 text-muted-foreground">{plan.description}</p>
                <ul role="list" className="mt-10 space-y-4 text-sm leading-6">
                  {Object.entries(plan.features).map(([feature, included]) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg
                        className={included ? "text-primary" : "text-muted-foreground"}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        height="20"
                        width="20"
                      >
                        {included ? (
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        )}
                      </svg>
                      <span className={included ? "" : "text-muted-foreground"}>{t`${feature}`}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 