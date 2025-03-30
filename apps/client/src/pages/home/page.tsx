import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { lazy, memo, Suspense, useEffect } from "react";
import { Helmet } from "react-helmet-async";

// import { ContributorsSection } from "./sections/contributors";
// Динамический импорт для ленивой загрузки секций
const FAQSection = lazy(() =>
  import("./sections/faq").then((module) => {
    return { default: module.FAQSection };
  }),
);
const FeaturesSection = lazy(() =>
  import("./sections/features").then((module) => {
    return { default: module.FeaturesSection };
  }),
);
const HeroSection = lazy(() =>
  import("./sections/hero").then((module) => {
    return { default: module.HeroSection };
  }),
);
// import { LogoCloudSection } from "./sections/logo-cloud";
// import { StatisticsSection } from "./sections/statistics";
// import { SupportSection } from "./sections/support";
const TemplatesSection = lazy(() =>
  import("./sections/templates").then((module) => {
    return { default: module.TemplatesSection };
  }),
);
// /import { TestimonialsSection } from "./sections/testimonials";
const PricingSection = lazy(() =>
  import("./sections/pricing").then((module) => {
    return { default: module.PricingSection };
  }),
);

// Дополнительная функция для предзагрузки модулей
const usePreloadModules = () => {
  useEffect(() => {
    // Предзагрузка основных модулей в фоне
    const preload = () => {
      // Предзагрузка основных компонентов с низким приоритетом
      const preloads = [
        import("./sections/features"),
        import("./sections/templates"),
        import("./sections/pricing"),
        import("./sections/faq"),
      ];

      // Используем requestIdleCallback для загрузки без блокировки основного потока
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => {
          Promise.all(preloads).catch(() => {
            // Если ошибка, не выводим ее
          });
        });
      } else {
        setTimeout(() => {
          Promise.all(preloads).catch(() => {
            // Если ошибка, не выводим ее
          });
        }, 1000);
      }
    };

    // Запускаем предзагрузку после гидратации компонента
    if (document.readyState === "complete") {
      preload();
    } else {
      window.addEventListener("load", preload);
      return () => {
        window.removeEventListener("load", preload);
      };
    }
  }, []);
};

// Компоненты-плейсхолдеры для ленивой загрузки
const SectionLoader = () => (
  <div className="bg-muted h-32 w-full animate-pulse rounded-lg opacity-30" />
);

export const HomePage = memo(() => {
  const { i18n } = useLingui();

  // Используем предзагрузку модулей
  usePreloadModules();

  return (
    <main className="relative isolate bg-background">
      <Helmet prioritizeSeoTags>
        <html lang={i18n.locale} />

        <title>
          {t`Reactive Resume`} - {t`A free and open-source resume builder`}
        </title>

        <meta
          name="description"
          content="A free and open-source resume builder that simplifies the process of creating, updating, and sharing your resume."
        />

        {/* Дополнительные мета-теги для SEO */}
        <meta
          property="og:title"
          content={`${t`Reactive Resume`} - ${t`A free and open-source resume builder`}`}
        />
        <meta
          property="og:description"
          content="A free and open-source resume builder that simplifies the process of creating, updating, and sharing your resume."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={window.location.href.split(/[#?]/)[0]} />
      </Helmet>

      {/* Приоритетная загрузка Hero секции */}
      <Suspense fallback={<SectionLoader />}>
        <HeroSection />
      </Suspense>
      {/* <LogoCloudSection /> */}
      {/* <StatisticsSection /> */}

      {/* Ленивая загрузка остальных секций с минимальным плейсхолдером */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <TemplatesSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PricingSection />
      </Suspense>

      {/* <TestimonialsSection /> */}
      <Suspense fallback={<SectionLoader />}>
        <FAQSection />
      </Suspense>
      {/* <SupportSection /> */}
      {/* <ContributorsSection /> */}
    </main>
  );
});
