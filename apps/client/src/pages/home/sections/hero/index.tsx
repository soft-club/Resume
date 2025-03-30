import { t } from "@lingui/macro";
import { motion } from "framer-motion";
import { lazy, Suspense, memo, useEffect } from "react";

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

export const HeroSection = memo(() => {
  return (
    <section id="hero" className="relative pt-32">
      <ImagePreloader />

      <Suspense fallback={null}>
        <Decoration.Grid />
      </Suspense>

      <Suspense fallback={null}>
        <Decoration.Gradient />
      </Suspense>

      <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:px-12">
        <motion.div
          className="mx-auto mt-16 max-w-3xl shrink-0 lg:mx-0 lg:mt-12 lg:max-w-xl"
          viewport={{ once: true }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              {t`Create the Perfect Resume in 5 Minutes with AI`}
            </h1>
          </div>

          <div className="prose prose-sm prose-zinc mt-4 space-y-2 text-base leading-6 dark:prose-invert">
            <p>{t`Get 3x more job offers with our smart resume editor. AI-powered analysis, professional templates, and instant export make it easy to create a standout resume in just a few clicks. Your dream job starts with a great resume—let's make it perfect!`}</p>
          </div>

          <div className="mt-6 flex items-center">
            <Suspense fallback={<div className="bg-muted/30 h-10 w-32 animate-pulse rounded-md" />}>
              <HeroCTA />
            </Suspense>
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-6 flex max-w-xl sm:mt-8 lg:ml-8 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-16"
          viewport={{ once: true }}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="max-w-2xl flex-none sm:max-w-3xl lg:max-w-none">
            <img
              src="/screenshots/builder.jpg"
              alt="Builder Screenshot"
              className="w-[32rem] rounded-lg bg-background/5 shadow-xl ring-1 ring-foreground/10"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
});
