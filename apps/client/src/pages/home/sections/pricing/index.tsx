import { t } from "@lingui/macro";
import { CurrencyDollar, Medal, Star } from "@phosphor-icons/react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@reactive-resume/ui";
import { motion } from "framer-motion";
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

// Анимация для карточек планов
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6 
    } 
  },
};

export const PricingSection = () => {
  const [isPaymentLoading] = useState<Record<string, boolean>>({});
  
  // Акцентные цвета для UI - такие же как в хедере и футере
  const accentGradient = "from-indigo-600 to-violet-600";
  const secondaryGradient = "from-rose-500 to-orange-500";

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
    <section className="py-24 sm:py-32" id="pricing">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { duration: 0.7 } 
            }
          }}
        >
          <div className="inline-block">
            <div className="relative">
              <div className={`absolute -inset-1 rounded-lg bg-gradient-to-r ${accentGradient} blur opacity-30`}></div>
              <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
                <span className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
                  {t`Pricing`}
                </span>
              </h2>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-foreground/70">
            {t`Our resume builder is always free! Create resumes without limits, and premium features will help make them even better.`}
          </p>
        </motion.div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {professionalPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-300"></div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${plan.id === "yearly" ? secondaryGradient : accentGradient} blur-sm opacity-70`}></div>
                      <div className="relative rounded-full bg-background/80 p-2">
                        {plan.id === "monthly" && (
                          <CurrencyDollar className="size-6 text-indigo-600" weight="bold" />
                        )}
                        {plan.id === "quarterly" && (
                          <Star className="size-6 text-indigo-600" weight="bold" />
                        )}
                        {plan.id === "yearly" && (
                          <Medal className="size-6 text-rose-500" weight="bold" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="flex w-full items-center justify-between">
                      <span>{plan.name}</span>
                      {plan.discount > 0 && (
                        <div className={`
                          relative inline-flex items-center overflow-hidden rounded-full px-3 py-1 text-xs font-medium
                          ${plan.id === "yearly" ? "bg-gradient-to-r from-rose-500 to-orange-500" : "bg-gradient-to-r from-indigo-600 to-violet-600"}
                          text-white shadow-sm
                        `}>
                          {t`Save`} {Math.round(plan.discount * 100)}%
                        </div>
                      )}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-x-2">
                    <span className={`text-5xl font-bold tracking-tight ${plan.id === "yearly" ? "bg-gradient-to-r from-rose-500 to-orange-500" : "bg-gradient-to-r from-indigo-600 to-violet-600"} bg-clip-text text-transparent`}>
                      {calculateMonthlyPrice(plan)}
                    </span>
                    <span className="text-base text-foreground/60">{plan.currency}/{t`monthly`}</span>
                  </div>

                  {plan.duration && (
                    <div className="mt-2 text-sm text-foreground/60">
                      {plan.id === "monthly" && t`Billed monthly`}
                      {plan.id === "quarterly" && t`Billed quarterly`}
                      {plan.id === "yearly" && t`Billed yearly`}
                    </div>
                  )}

                  <p className="mt-6 text-base leading-7 text-foreground/70">{plan.description}</p>

                  <ul className="mt-8 space-y-4 text-sm leading-6">
                    {Object.entries(plan.features).map(([feature, included]) => (
                      <li key={feature} className="flex items-center gap-x-3">
                        <svg
                          className={`size-5 flex-none ${included ? (plan.id === "yearly" ? "text-rose-500" : "text-indigo-600") : "text-gray-400"}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className={included ? "font-medium" : "text-foreground/60"}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 space-y-3">
                    <Button
                      asChild
                      className={`group relative w-full overflow-hidden ${
                        plan.id === "yearly" 
                          ? "bg-gradient-to-r from-rose-500 to-orange-500 hover:shadow-rose-500/30" 
                          : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-500/30"
                      } transition-all duration-300 hover:shadow-lg`}
                    >
                      <Link to="/dashboard/subscription">
                        <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></span>
                        <span className="relative">{t`Upgrade`}</span>
                      </Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        className="relative overflow-hidden bg-background/5 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                        variant="outline"
                        disabled={isPaymentLoading[plan.id]}
                        onClick={() => {
                          handlePaymePayment(plan);
                        }}
                      >
                        <span className="relative">{t`PayMe`}</span>
                      </Button>
                      <Button
                        className="relative overflow-hidden bg-background/5 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                        variant="outline"
                        disabled={isPaymentLoading[plan.id]}
                        onClick={() => {
                          handleClickPayment(plan);
                        }}
                      >
                        <span className="relative">{t`Click`}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
