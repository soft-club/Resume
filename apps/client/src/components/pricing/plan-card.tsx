import { t } from "@lingui/macro";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@reactive-resume/ui";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: Record<string, boolean>;
};

type PlanCardProps = {
  plan: SubscriptionPlan;
  isActive: boolean;
  showSubscribeButton?: boolean;
  onSubscribe?: (plan: SubscriptionPlan) => void;
};

export const PlanCard = ({
  plan,
  isActive,
  showSubscribeButton = true,
  onSubscribe,
}: PlanCardProps) => {
  const handleSubscribe = () => {
    if (onSubscribe && !isActive) {
      onSubscribe(plan);
    }
  };

  return (
    <Card className={isActive ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-x-2">
          <span className="text-5xl font-bold tracking-tight">
            {plan.price} {plan.currency}
          </span>
          <span className="text-base text-gray-500">/{t`month`}</span>
        </div>
        <p className="mt-6 text-base leading-7 text-gray-500">{plan.description}</p>
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
              {isActive ? t`Current Plan` : t`Subscribe`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
