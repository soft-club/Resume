import { t } from "@lingui/macro";
import { Button, Card, CardContent } from "@reactive-resume/ui";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router";

export const PaymePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Базовые цены планов
  const planPrices = {
    monthly: 49_000,
    quarterly: 39_200, // со скидкой 20%
    yearly: 29_400, // со скидкой 40%
  };

  // Продолжительность каждого плана в месяцах
  const planDurations = {
    monthly: 1,
    quarterly: 3,
    yearly: 12,
  };

  // Соответствие планов в нашем интерфейсе планам в базе данных
  const planMapping = {
    monthly: "monthly-plan",
    quarterly: "quarterly-plan",
    yearly: "yearly-plan",
  };

  // Получение цены и продолжительности плана
  const getPlanDetails = () => {
    const price =
      planId && planId in planPrices ? planPrices[planId as keyof typeof planPrices] : 0;
    const duration =
      planId && planId in planDurations ? planDurations[planId as keyof typeof planDurations] : 0;
    const dbPlanId =
      planId && planId in planMapping ? planMapping[planId as keyof typeof planMapping] : "";
    return { price, duration, dbPlanId };
  };

  const { price, duration, dbPlanId } = getPlanDetails();

  // Мутация для создания платежа
  const createPayment = useMutation({
    mutationFn: async () => {
      // Сначала создаем подписку
      const subscriptionResponse = await axios.post("/api/subscription", {
        planId: dbPlanId,
        duration: duration,
      });

      // Затем создаем платеж через PayMe
      const paymentResponse = await axios.post("/api/payment/create-intent", {
        amount: price,
        currency: "UZS",
        description: t`Subscription: ` + String(subscriptionResponse.data.id),
        subscriptionId: subscriptionResponse.data.id,
        paymentMethod: "payme",
      });

      return paymentResponse.data;
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        setPaymentUrl(data.paymentUrl);
      } else {
        setError(t`Не удалось получить ссылку для оплаты`);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("Payment creation error:", error);
      setError(t`Ошибка при создании платежа. Пожалуйста, попробуйте еще раз.`);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    // Инициализируем создание платежа при загрузке страницы
    if (planId && price > 0) {
      createPayment.mutate();
    } else {
      setError(t`Выбран некорректный план подписки`);
      setIsLoading(false);
    }
  }, [planId, price]);

  return (
    <>
      <Helmet>
        <title>
          {t`Оплата через PayMe`} - {t`Reactive Resume`}
        </title>
      </Helmet>
      <div className="max-w-2xl space-y-4">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          {t`Оплата через PayMe`}
        </motion.h1>
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-12 lg:px-8">
        <Card>
          <CardContent className="p-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-center">{t`Подготовка платежа...`}</p>
              </div>
            )}

            {!isLoading && error && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-error/20 p-3">
                  <svg
                    className="size-6 text-error"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" x2="9" y1="9" y2="15" />
                    <line x1="9" x2="15" y1="9" y2="15" />
                  </svg>
                </div>
                <p className="text-center text-xl font-semibold text-error">{error}</p>
                <Button asChild className="mt-6">
                  <Link to="/dashboard/subscription">{t`Вернуться к подпискам`}</Link>
                </Button>
              </div>
            )}

            {!isLoading && !error && paymentUrl && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="mb-6 text-center text-lg">
                  {t`Нажмите кнопку ниже, чтобы перейти к оплате через PayMe.`}
                </p>
                <div className="flex space-x-4">
                  <Button asChild variant="primary">
                    <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                      {t`Перейти к оплате`}
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/dashboard/subscription">{t`Отмена`}</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymePage;
