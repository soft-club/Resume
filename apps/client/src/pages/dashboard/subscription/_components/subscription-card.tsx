import { t } from "@lingui/macro";
import { Check } from "@phosphor-icons/react";
import { 
  Button,
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@reactive-resume/ui";
import { useState } from "react";
import { PaymentModal } from "./payment-modal";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: Record<string, boolean>;
};

type SubscriptionCardProps = {
  plan: SubscriptionPlan;
  isActive: boolean;
};

// Форматирование цены с учетом валюты
const formatPrice = (price: number, currency: string): string => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
  });
  
  return formatter.format(price);
};

// Форматирование длительности подписки
const formatDuration = (days: number): string => {
  if (days === 30 || days === 31) return t`1 month`;
  if (days === 365 || days === 366) return t`1 year`;
  
  const months = Math.round(days / 30);
  return months === 1 ? t`${months} month` : t`${months} months`;
};

export const SubscriptionCard = ({ plan, isActive }: SubscriptionCardProps) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Преобразование объекта функций в массив для отображения
  const featuresArray = Object.entries(plan.features || {}).map(([key, value]) => ({
    key,
    value,
    available: Boolean(value),
  }));

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };
  
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  return (
    <>
      <Card className={isActive ? "border-primary" : ""}>
        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <span className="text-3xl font-bold">{formatPrice(plan.price, plan.currency)}</span>
            <span className="text-muted-foreground"> / {formatDuration(plan.duration)}</span>
          </div>
          
          <ul className="space-y-2">
            {featuresArray.map((feature) => (
              <li key={feature.key} className="flex items-center gap-2">
                {feature.available ? (
                  <Check className="text-primary" weight="bold" />
                ) : (
                  <span className="size-4 opacity-50" />
                )}
                <span className={feature.available ? "" : "text-muted-foreground"}>
                  {feature.key}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={isActive}
            variant={isActive ? "outline" : "primary"}
            onClick={handleOpenPaymentModal}
          >
            {isActive ? t`Current Plan` : t`Subscribe`}
          </Button>
        </CardFooter>
      </Card>
      
      <PaymentModal
        isOpen={isPaymentModalOpen}
        plan={plan}
        onClose={handleClosePaymentModal}
      />
    </>
  );
}; 