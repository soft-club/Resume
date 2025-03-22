import { t } from "@lingui/macro";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@reactive-resume/ui";
import { useState } from "react";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: Record<string, boolean>;
};

type PeriodOption = {
  months: number;
  pricePerMonth: number;
  discountPercentage?: number;
};

type PlanCardProps = {
  plan: SubscriptionPlan;
  isActive: boolean;
  showSubscribeButton?: boolean;
  onSubscribe?: (plan: SubscriptionPlan, duration: number) => void;
  periodOptions?: PeriodOption[];
};

export const PlanCard = ({
  plan,
  isActive,
  showSubscribeButton = true,
  onSubscribe,
  periodOptions = [
    { months: 1, pricePerMonth: plan.price, discountPercentage: 0 },
    { months: 3, pricePerMonth: plan.price * 0.9, discountPercentage: 10 },
    { months: 12, pricePerMonth: plan.price * 0.75, discountPercentage: 25 },
  ],
}: PlanCardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(periodOptions[0]);
  const isFree = plan.price === 0;

  const handleSubscribe = () => {
    if (onSubscribe && !isActive) {
      onSubscribe(plan, selectedPeriod.months);
    }
  };

  const formatCurrency = (value: number): string => {
    return `${value} ${plan.currency}`;
  };

  return (
    <Card className={isActive ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-x-2">
          <span className="text-5xl font-bold tracking-tight">
            {isFree ? t`Free` : formatCurrency(selectedPeriod.pricePerMonth)}
          </span>
          {!isFree && <span className="text-base text-gray-500">/{t`month`}</span>}
        </div>
        <p className="mt-6 text-base leading-7 text-gray-500">{plan.description}</p>

        {/* Опции периода для платных планов */}
        {!isFree && showSubscribeButton && (
          <div className="mt-6 flex flex-wrap gap-2">
            {periodOptions.map((period) => (
              <Button
                key={period.months}
                className="flex-1"
                variant={selectedPeriod.months === period.months ? "default" : "outline"}
                onClick={() => setSelectedPeriod(period)}
              >
                {period.months === 1
                  ? t`Monthly`
                  : period.months === 12
                  ? t`Yearly`
                  : t`${period.months} months`}
                {period.discountPercentage && period.discountPercentage > 0 ? (
                  <span className="ml-1 text-xs">(-{period.discountPercentage}%)</span>
                ) : null}
              </Button>
            ))}
          </div>
        )}

        {/* Полная цена для платных планов */}
        {!isFree && selectedPeriod.months > 1 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            {t`Total: ${formatCurrency(selectedPeriod.pricePerMonth * selectedPeriod.months)}`}
          </div>
        )}

        <ul className="mt-10 space-y-4 text-sm leading-6">
          {Object.entries(plan.features).map(([feature, included]) => (
            <li key={feature} className="flex gap-x-3">
              <svg
                className={included ? "text-primary" : "text-gray-500"}
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
              <span className={included ? "" : "text-gray-500"}>{t`Feature: ${feature}`}</span>
            </li>
          ))}
        </ul>
        {showSubscribeButton && (
          <div className="mt-10">
            <Button
              className="w-full"
              disabled={isActive}
              variant={isActive ? "outline" : "primary"}
              onClick={handleSubscribe}
            >
              {isActive ? t`Current Plan` : isFree ? t`Get Started` : t`Subscribe`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
