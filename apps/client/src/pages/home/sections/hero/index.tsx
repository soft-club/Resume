import { t } from "@lingui/macro";
import { ArrowRight } from "@phosphor-icons/react";
import { Badge, buttonVariants } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { motion } from "framer-motion";

import { HeroCTA } from "./call-to-action";
import { Decoration } from "./decoration";

export const HeroSection = () => (
  <section id="hero" className="relative">
    <Decoration.Grid />
    <Decoration.Gradient />

    <div className="mx-auto max-w-7xl px-6 lg:flex lg:h-screen lg:items-center lg:px-12">
      <motion.div
        className="mx-auto mt-32 max-w-3xl shrink-0 lg:mx-0 lg:mt-0 lg:max-w-xl lg:pt-8"
        viewport={{ once: true }}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="hidden items-center gap-x-4 sm:flex">
          <Badge>{t`Version 4`}</Badge>

          <a
            href="https://docs.rxresu.me/overview/features"
            className={cn(buttonVariants({ variant: "link" }), "space-x-2 text-left")}
          >
            <p>{t`What's new in the latest version`}</p>
            <ArrowRight />
          </a>
        </div>

        <div className="mt-10 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t`Tell your story. Get your dream job.`}
          </h1>
        </div>

        <p className="prose prose-base prose-zinc mt-6 text-lg leading-8 dark:prose-invert">
          {t`We don't just help people create resumes - we give them the opportunity to tell their story in a way that gets them noticed. Because a great career starts with one page, and we'll make it perfect.`}
        </p>

        <div className="mt-10 flex items-center gap-x-8">
          <HeroCTA />
        </div>
      </motion.div>

      <motion.div
        className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-20"
        viewport={{ once: true }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
          <img
            src="/screenshots/builder.jpg"
            alt="Builder Screenshot"
            className="w-[40rem] rounded-lg bg-background/5 shadow-2xl ring-1 ring-foreground/10"
          />
        </div>
      </motion.div>
    </div>
  </section>
);
