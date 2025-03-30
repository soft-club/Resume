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

// Плавная анимация для навигации по секциям
const useSmoothScroll = () => {
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");
      const href = link?.getAttribute("href");

      if (href?.startsWith("#")) {
        const element = document.querySelector(href);

        if (element) {
          event.preventDefault();
          element.scrollIntoView({ behavior: "smooth", block: "start" });

          // Обновляем URL без перезагрузки страницы
          window.history.pushState(null, "", href);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);
};

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

// Современный, стилизованный лоадер для секций
const SectionLoader = () => (
  <div className="flex h-96 w-full items-center justify-center">
    <div className="relative size-16">
      <div className="size-16 rounded-full border-2 border-background" />
      <div className="absolute left-0 top-0 size-16 animate-spin rounded-full border-b-2 border-l-2 border-primary" />
    </div>
  </div>
);

// Декоративный разделитель между секциями
const SectionDivider = () => (
  <div className="relative mx-auto my-16 h-px w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <div className="h-px w-full bg-border" />
    </div>
    <div className="relative flex justify-center">
      <div className="flex size-8 items-center justify-center rounded-full bg-background ring-1 ring-inset ring-border">
        <div className="size-2 rounded-full bg-primary" />
      </div>
    </div>
  </div>
);

export const HomePage = memo(() => {
  const { i18n } = useLingui();

  // Используем хуки
  usePreloadModules();
  useSmoothScroll();

  return (
    <main className="relative isolate overflow-hidden bg-background">
      {/* Фоновые элементы для всей страницы */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary-foreground opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

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

      <SectionDivider />

      {/* Ленивая загрузка остальных секций с минимальным плейсхолдером */}
      <div id="features">
        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>
      </div>

      <SectionDivider />

      <div id="templates">
        <Suspense fallback={<SectionLoader />}>
          <TemplatesSection />
        </Suspense>
      </div>

      <SectionDivider />

      <div id="pricing">
        <Suspense fallback={<SectionLoader />}>
          <PricingSection />
        </Suspense>
      </div>

      <SectionDivider />

      <div id="faq">
        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>
      </div>

      {/* Декоративный элемент внизу страницы */}
      <div
        className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-foreground to-primary opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </main>
  );
});
