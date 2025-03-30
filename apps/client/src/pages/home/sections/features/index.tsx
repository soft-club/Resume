import { t } from "@lingui/macro";
import { Download, FileText, Robot } from "@phosphor-icons/react";
import { cn } from "@reactive-resume/utils";
import { motion } from "framer-motion";

type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  lineColor: string;
  gradientFrom: string;
  gradientTo: string;
};

export const FeaturesSection = () => {
  const features: Feature[] = [
    {
      id: "01",
      icon: <FileText weight="duotone" className="size-10" />,
      title: t`Edit & Enhance with AI`,
      description: t`Our smart editor analyzes your resume, suggests improvements, and helps you make it stronger to grab employers' attention.`,
      lineColor: "border-t-amber-500",
      gradientFrom: "from-amber-500",
      gradientTo: "to-orange-600",
    },
    {
      id: "02",
      icon: <Robot weight="duotone" className="size-10" />,
      title: t`Choose a Template`,
      description: t`Select from our collection of professionally designed and stylish templates that make you stand out.`,
      lineColor: "border-t-purple-500",
      gradientFrom: "from-indigo-600",
      gradientTo: "to-violet-600",
    },
    {
      id: "03",
      icon: <Download weight="duotone" className="size-10" />,
      title: t`Download & Use`,
      description: t`Review the final result, ensure your resume is fully polished, and download it as a PDF or share it via an online link.`,
      lineColor: "border-t-emerald-500",
      gradientFrom: "from-emerald-500",
      gradientTo: "to-teal-600",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Декоративные элементы на заднем плане */}
      <div className="absolute -top-24 right-1/4 size-[400px] rounded-full bg-gradient-to-br from-indigo-600/10 to-violet-600/10 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 size-[400px] rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
        >
          <div className="inline-block">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 opacity-30 blur"></div>
              <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {t`Optimize Your Resume with AI`}
                </span>
              </h2>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-foreground/70">
            {t`Avoid mistakes, get a professional format, and increase your chances of landing an interview. With us, powered by artificial intelligence, creating the perfect resume has never been easier.`}
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-7xl"
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="group relative flex flex-col items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: index * 0.2 },
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className={cn("w-full border-t-2", feature.lineColor)} />

                <div className="mt-8 flex w-full items-center justify-between">
                  <span className="bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-5xl font-bold text-transparent dark:from-gray-100 dark:to-gray-400">
                    {feature.id}
                  </span>

                  <div className="relative">
                    <div
                      className={`absolute -inset-3 rounded-lg bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} opacity-0 blur-md transition-all duration-300 group-hover:opacity-30`}
                    ></div>
                    <div
                      className={`relative bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} rounded-full p-3 text-white`}
                    >
                      {feature.icon}
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
                  {feature.title}
                </h3>

                <p className="mt-4 text-base leading-7 text-foreground/70">{feature.description}</p>

                <div className="mt-6 size-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:size-auto group-hover:opacity-100">
                  <span
                    className={`inline-flex items-center bg-gradient-to-r text-sm font-medium ${feature.gradientFrom} ${feature.gradientTo} bg-clip-text text-transparent`}
                  >
                    {t`Узнать больше`}
                    <svg
                      className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1"
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
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
