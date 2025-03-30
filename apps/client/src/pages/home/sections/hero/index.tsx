import { t } from "@lingui/macro";
import { motion } from "framer-motion";
import { lazy, memo, Suspense, useEffect } from "react";

// Ленивая загрузка компонентов
const HeroCTA = lazy(() => import("./call-to-action").then((m) => ({ default: memo(m.HeroCTA) })));
const Decoration = {
  Grid: lazy(() => import("./decoration").then((m) => ({ default: memo(m.Decoration.Grid) }))),
  Gradient: lazy(() =>
    import("./decoration").then((m) => ({ default: memo(m.Decoration.Gradient) })),
  ),
};

// Компонент для предзагрузки изображения
const ImagePreloader = () => {
  useEffect(() => {
    const img = new Image();
    img.src = "/screenshots/builder.jpg";
  }, []);

  return null;
};

// Анимационные варианты
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const HeroSection = memo(() => {
  return (
    <section id="hero" className="relative overflow-hidden pt-24 sm:pt-32">
      <ImagePreloader />

      {/* Фоновые украшения */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(var(--primary-rgb),0.12),rgba(var(--background-rgb),0))]" />

      <Suspense fallback={null}>
        <Decoration.Grid />
      </Suspense>

      <Suspense fallback={null}>
        <Decoration.Gradient />
      </Suspense>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <motion.div
          className="mx-auto mt-16 max-w-3xl shrink-0 lg:mx-0 lg:mt-0 lg:max-w-xl"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-x-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <svg className="size-1.5 fill-primary" viewBox="0 0 6 6" aria-hidden="true">
                <circle cx="3" cy="3" r="3" />
              </svg>
              {t`New Features`}
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                {t`Create the Perfect Resume`}
              </span>
              <span className="block">{t`in 5 Minutes with AI`}</span>
            </h1>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="text-muted-foreground mt-6 text-base leading-7 sm:text-lg md:text-xl"
          >
            <p>{t`Get 3x more job offers with our smart resume editor. AI-powered analysis, professional templates, and instant export make it easy to create a standout resume in just a few clicks.`}</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center gap-4">
            <Suspense
              fallback={<div className="h-12 w-36 animate-pulse rounded-md bg-primary/20" />}
            >
              <HeroCTA />
            </Suspense>

            <a
              href="#templates"
              className="hover:bg-muted inline-flex h-12 items-center gap-x-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              tabIndex={0}
              aria-label={t`View templates`}
            >
              {t`View templates`}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-8 w-full max-w-2xl lg:mt-0 lg:max-w-none lg:flex-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Декоративный эффект сияния за скриншотом */}
          <div className="absolute -inset-4 -z-10 bg-[radial-gradient(closest-side,rgba(var(--primary-rgb),0.1),transparent)]" />

          <div className="bg-card relative overflow-hidden rounded-xl border border-border/40 shadow-xl">
            {/* Блик на скриншоте */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <img
              src="/screenshots/builder.jpg"
              alt="Builder Screenshot"
              className="w-full object-cover shadow-sm"
              loading="eager"
              fetchPriority="high"
            />

            {/* Глянцевый эффект */}
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
});
