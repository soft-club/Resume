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
};

export const FeaturesSection = () => {
  const features: Feature[] = [
    {
      id: "01",
      icon: <FileText className="size-8 text-amber-500" />,
      title: t`Edit & Enhance with AI`,
      description: t`Our smart editor analyzes your resume, suggests improvements, and helps you make it stronger to grab employers' attention.`,
      lineColor: "border-t-amber-500",
    },
    {
      id: "02",
      icon: <Robot className="size-8 text-purple-500" />,
      title: t`Choose a Template`,
      description: t`Select from our collection of professionally designed and stylish templates that make you stand out.`,
      lineColor: "border-t-purple-500",
    },
    {
      id: "03",
      icon: <Download className="size-8 text-emerald-500" />,
      title: t`Download & Use`,
      description: t`Review the final result, ensure your resume is fully polished, and download it as a PDF or share it via an online link.`,
      lineColor: "border-t-emerald-500",
    },
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          className="text-center"
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t`Optimize Your Resume with AI`}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8">
            {t`Avoid mistakes, get a professional format, and increase your chances of landing an interview. With us, powered by artificial intelligence, creating the perfect resume has never been easier.`}
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-7xl"
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.id} className="relative flex flex-col items-start">
                <div className={cn("w-full border-t-2", feature.lineColor)} />
                <div className="mt-8 flex w-full items-center justify-between">
                  <span className="text-4xl font-bold">{feature.id}</span>
                  <div>{feature.icon}</div>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-4 text-base leading-7">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
