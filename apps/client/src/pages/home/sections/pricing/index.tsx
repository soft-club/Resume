import { t } from "@lingui/macro";
import { CurrencyDollar, Medal, Star } from "@phosphor-icons/react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@reactive-resume/ui";
import { Link } from "react-router";

type ProfessionalPlan = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  currency: string;
  discount: number;
  features: Record<string, boolean>;
};

export const PricingSection = () => {
  // Статичные планы для отображения вариантов профессионального плана
  const professionalPlans: ProfessionalPlan[] = [
    {
      id: "monthly",
      name: t`Monthly Plan`,
      description: t`For those who need flexibility and access to all features without long-term commitments.`,
      basePrice: 49_000,
      currency: "UZS",
      duration: 1,
      discount: 0,
      features: {
        [t`Неограниченное количество резюме`]: true,
        [t`Пользовательские шаблоны`]: true,
        [t`Экспорт в PDF`]: true,
        [t`Приоритетная поддержка`]: true,
      },
    },
    {
      id: "quarterly",
      name: t`Quarterly Plan`,
      description: t`Save 20% and get 3 months of uninterrupted access to all premium features!`,
      basePrice: 49_000,
      currency: "UZS",
      duration: 3,
      discount: 0.2,
      features: {
        [t`Неограниченное количество резюме`]: true,
        [t`Пользовательские шаблоны`]: true,
        [t`Экспорт в PDF`]: true,
        [t`Приоритетная поддержка`]: true,
      },
    },
    {
      id: "yearly",
      name: t`Yearly Plan`,
      description: t`Save 40% and get 12 months of uninterrupted access to all premium features!`,
      basePrice: 49_000,
      currency: "UZS",
      duration: 12,
      discount: 0.4,
      features: {
        [t`Неограниченное количество резюме`]: true,
        [t`Пользовательские шаблоны`]: true,
        [t`Экспорт в PDF`]: true,
        [t`Приоритетная поддержка`]: true,
      },
    },
  ];

  const calculateMonthlyPrice = (plan: ProfessionalPlan) => {
    const price = plan.basePrice * (1 - plan.discount);
    return price.toLocaleString("ru-RU");
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t`Pricing`}</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8">
            {t`Our resume builder is always free! Create resumes without limits, and premium features will help make them even better.`}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {professionalPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    {plan.id === "monthly" && (
                      <CurrencyDollar className="size-6 text-primary" weight="bold" />
                    )}
                    {plan.id === "quarterly" && (
                      <Star className="size-6 text-primary" weight="bold" />
                    )}
                    {plan.id === "yearly" && (
                      <Medal className="size-6 text-primary" weight="bold" />
                    )}
                  </div>
                  <CardTitle className="flex w-full items-center justify-between">
                    <span>{plan.name}</span>
                    {plan.discount > 0 && (
                      <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        {t`Save`} {Math.round(plan.discount * 100)}%
                      </div>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight">
                    {calculateMonthlyPrice(plan)} {plan.currency}
                  </span>
                  <span className="text-base text-gray-500">/{t`monthly`}</span>
                </div>

                {plan.duration && (
                  <div className="mt-2 text-sm text-gray-500">
                    {plan.id === "monthly" && t`Billed monthly`}
                    {plan.id === "quarterly" && t`Billed quarterly`}
                    {plan.id === "yearly" && t`Billed yearly`}
                  </div>
                )}

                <p className="mt-6 text-base leading-7 text-gray-500">{plan.description}</p>

                <ul className="mt-10 space-y-4 text-sm leading-6">
                  {Object.entries(plan.features).map(([feature, included]) => (
                    <li key={feature} className="flex gap-x-3">
                      <span className={included ? "" : "text-gray-500"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Button asChild className="w-full" variant="primary">
                    <Link to="/dashboard/subscription">{t`Upgrade`}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
