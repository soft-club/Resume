import { t } from "@lingui/macro";
import { CurrencyDollar, Medal, Star } from "@phosphor-icons/react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@reactive-resume/ui";
import { useState } from "react";
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
  const [isPaymentLoading] = useState<Record<string, boolean>>({});

  // Функция для создания прямой ссылки на PayMe
  const handlePaymePayment = (plan: ProfessionalPlan) => {
    // Используем демонстрационный ID мерчанта PayMe (для тестирования)
    const merchantId = "6423b91fd7576108eda85482";

    // Рассчитываем сумму в тийинах (1/100 сума)
    const amount = Math.round(plan.basePrice * (1 - plan.discount)) * 100;

    // Создаем объект данных для оплаты
    const orderData = {
      merchant: merchantId,
      amount,
      account: { id: plan.id },
      callback: window.location.origin,
      lang: "ru",
    };

    // Кодируем данные в base64
    const orderDataEncoded = btoa(JSON.stringify(orderData));

    // Формируем URL для PayMe checkout
    const paymeUrl = `https://checkout.paycom.uz/${orderDataEncoded}`;

    // Открываем ссылку в новом окне
    window.open(paymeUrl, "_blank");
  };

  // Функция для создания прямой ссылки на Click
  const handleClickPayment = (plan: ProfessionalPlan) => {
    // Используем демонстрационные данные для Click (заменить на реальные при подключении)
    const merchantId = "12345"; // ID поставщика
    const serviceId = "12345"; // ID сервиса
    
    // Рассчитываем сумму платежа
    const amount = Math.round(plan.basePrice * (1 - plan.discount));
    
    // Используем ID плана как идентификатор транзакции
    const transactionParam = `subscription_${plan.id}_${Date.now()}`;
    
    // Формируем URL для Click checkout
    const clickUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${transactionParam}&return_url=${window.location.origin}`;
    
    // Открываем ссылку в новом окне
    window.open(clickUrl, "_blank");
  };

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
                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    disabled={isPaymentLoading[plan.id]}
                    onClick={() => {
                      handlePaymePayment(plan);
                    }}
                  >
                    {t`Оплатить через PayMe`}
                  </Button>
                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    disabled={isPaymentLoading[plan.id]}
                    onClick={() => {
                      handleClickPayment(plan);
                    }}
                  >
                    {t`Оплатить через Click`}
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
