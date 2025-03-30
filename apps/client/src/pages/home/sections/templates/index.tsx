import { t } from "@lingui/macro";
import { templatesList } from "@reactive-resume/utils";
import { motion } from "framer-motion";

export const TemplatesSection = () => {
  // Градиенты для UI - как в других секциях
  const accentGradient = t`from-indigo-600 to-violet-600`;

  return (
    <section id="templates" className="relative overflow-hidden py-24 sm:py-32">
      {/* Декоративные элементы на заднем плане */}
      <div className="absolute -left-1/4 -top-24 size-[500px] rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-1/4 size-[500px] rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/20 blur-3xl" />

      <div className="container relative mx-auto px-6 lg:px-8">
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
              transition: { duration: 0.7 },
            },
          }}
        >
          <div className="inline-block">
            <div className="relative">
              <div
                className={`absolute -inset-1 rounded-lg bg-gradient-to-r ${accentGradient} opacity-30 blur`}
              ></div>
              <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
                <span
                  className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}
                >
                  {t`Resume Templates`}
                </span>
              </h2>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-foreground/70">
            {t`Explore the templates available in our editor and browse through example resumes created with them. They can inspire you and guide you in crafting your perfect resume.`}
          </p>
        </motion.div>

        <div className="mx-auto mt-16 w-full overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-xl border border-gray-200 dark:border-gray-800"></div>
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-background to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-background to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-background to-transparent"></div>

            <motion.div
              animate={{
                x: [0, templatesList.length * 220 * -1],
                transition: {
                  x: {
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "linear",
                  },
                },
              }}
              className="flex items-center gap-x-8 py-8"
            >
              {templatesList.map((template, index) => (
                <motion.a
                  key={index}
                  target="_blank"
                  rel="noreferrer"
                  href={`templates/pdf/${template}.pdf`}
                  className="group relative flex-none"
                  viewport={{ once: true }}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    {/* Эффект свечения при наведении */}
                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-indigo-600 to-rose-500 opacity-0 blur transition-all duration-300 group-hover:opacity-100"></div>

                    <div className="relative aspect-[1/1.4142] h-[300px] overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/20 dark:bg-gray-950 lg:h-[420px]">
                      <img
                        alt={template}
                        loading="lazy"
                        src={`/templates/jpg/${template}.jpg`}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />

                      {/* Оверлей с именем шаблона */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-all duration-300 group-hover:h-2/5">
                        <p className="text-center font-bold capitalize text-white">{template}</p>
                        <div className="mt-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {t`Посмотреть PDF`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="/builder"
            className={`relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${accentGradient} px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50`}
          >
            <span>{t`Создать резюме сейчас`}</span>
            <svg
              className="size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
