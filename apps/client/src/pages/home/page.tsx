import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, memo, Suspense, useEffect, useRef, useState } from "react";
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

// Компонент кнопки прокрутки вверх
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Отслеживаем прокрутку страницы
  useEffect(() => {
    const toggleVisibility = () => {
      // Показываем кнопку, когда прокручено больше 500px
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-1 ring-black/10 transition-colors hover:bg-primary/90"
          aria-label={t`Scroll to top`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScrollToTop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Компонент плавающей кнопки быстрого действия (FAB)
const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCreateResume = () => {
    // Дополнительная логика для создания резюме
    window.location.href = "/builder/resume/new";
  };

  const handleCreateFromTemplate = () => {
    // Перенаправление на страницу с шаблонами
    window.location.href = "#templates";
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 left-1 flex flex-col space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <motion.button
              className="flex items-center space-x-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-black/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={t`Create from template`}
              onClick={handleCreateFromTemplate}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              <span>{t`From template`}</span>
            </motion.button>

            <motion.button
              className="flex items-center space-x-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={t`Create new resume`}
              onClick={handleCreateResume}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>{t`New resume`}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`flex size-14 items-center justify-center rounded-full shadow-lg ${isOpen ? "bg-gray-700" : "bg-primary"} text-white transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? t`Close menu` : t`Create resume`}
        aria-expanded={isOpen}
        onClick={toggleOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              xmlns="http://www.w3.org/2000/svg"
              className="size-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="create"
              xmlns="http://www.w3.org/2000/svg"
              className="size-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

// Компонент статистики с анимацией
const StatisticsSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Наблюдаем за появлением секции в видимой области
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect(); // Остановка наблюдения после срабатывания
          }
        }
      },
      { threshold: 0.2 }, // Активируется, когда 20% секции видно
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Статистические данные
  const stats = [
    { id: 1, name: t`Users`, value: "50K+", delay: 0 },
    { id: 2, name: t`Resumes Created`, value: "100K+", delay: 0.1 },
    { id: 3, name: t`Job Offers`, value: "8K+", delay: 0.2 },
    { id: 4, name: t`Countries`, value: "180+", delay: 0.3 },
  ];

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 lg:py-24">
      {/* Фоновый паттерн */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <svg width="100%" height="100%" className="text-gray-900" stroke="currentColor">
          <pattern
            id="statsPattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 10h20M10 0v20" fill="none" strokeWidth="0.5" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#statsPattern)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t`Trusted by thousands worldwide`}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              {t`Join our community of job seekers who have successfully used our platform to advance their careers.`}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 lg:mt-16 lg:gap-12">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                className="overflow-hidden rounded-lg bg-primary/5 px-4 py-6 text-center shadow-sm sm:px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: stat.delay, ease: "easeOut" }}
              >
                <motion.dt
                  className="text-muted-foreground truncate text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={visible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: stat.delay + 0.2 }}
                >
                  {stat.name}
                </motion.dt>
                <motion.dd
                  className="mt-1 text-3xl font-semibold tracking-tight text-primary sm:text-4xl"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={visible ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.6, delay: stat.delay + 0.3, type: "spring" }}
                >
                  {stat.value}
                </motion.dd>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

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

      {/* Кнопка прокрутки вверх */}
      <ScrollToTopButton />

      {/* Плавающая кнопка действия */}
      <FloatingActionButton />

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

      {/* Секция статистики */}
      <div id="statistics">
        <StatisticsSection />
      </div>

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
