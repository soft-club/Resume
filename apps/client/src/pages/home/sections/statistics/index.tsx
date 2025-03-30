import { t } from "@lingui/macro";
import { motion } from "framer-motion";

import { Counter } from "./counter";

type Statistic = {
  name: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
};

export const StatisticsSection = () => {
  const stats: Statistic[] = [
    {
      name: t`GitHub Stars`,
      value: 27_000,
      icon: (
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      gradient: t`from-purple-600 to-indigo-600`,
    },
    {
      name: t`Users Signed Up`,
      value: 650_000,
      icon: (
        <svg
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      gradient: t`from-amber-500 to-rose-500`,
    },
    {
      name: t`Resumes Generated`,
      value: 840_000,
      icon: (
        <svg
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      gradient: t`from-emerald-500 to-cyan-500`,
    },
  ];

  return (
    <section id="statistics" className="relative overflow-hidden py-24 sm:py-32">
      {/* Декоративные элементы на заднем плане */}
      <div className="absolute left-1/4 top-1/4 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-600/10 to-violet-600/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 size-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-br from-rose-500/10 to-orange-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t`Growing Impact`}
            </span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-foreground/70">
            {t`Join thousands of professionals who trust our platform for their resume creation needs.`}
          </p>
        </motion.div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group mx-auto flex max-w-xs flex-col gap-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="relative mx-auto">
                <div
                  className={`absolute -inset-4 bg-gradient-to-r ${stat.gradient} rounded-lg opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20`}
                ></div>
                <div
                  className={`relative mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-r ${stat.gradient} text-white`}
                >
                  {stat.icon}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <dd className="order-first text-4xl font-bold tracking-tight sm:text-6xl">
                  <div
                    className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    <Counter from={0} to={stat.value} />
                    <span className="inline-block translate-y-1 text-xl font-normal">+</span>
                  </div>
                </dd>
                <dt className="mt-2 text-base font-medium leading-7">{stat.name}</dt>
              </div>

              <div
                className={`mx-auto h-1 w-16 rounded-full bg-gradient-to-r ${stat.gradient} opacity-60 transition-all duration-300 group-hover:w-24 group-hover:opacity-100`}
              ></div>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
};
