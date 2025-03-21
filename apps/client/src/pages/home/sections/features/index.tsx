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
      title: t`Choose a template`,
      description: t`Choose from our wide range of free, professionally designed resume templates optimized for ATS systems.`,
      lineColor: "border-t-amber-500",
    },
    {
      id: "02",
      icon: <Robot className="size-8 text-purple-500" />,
      title: t`Edit and optimize with AI`,
      description: t`Our advanced AI resume builder will help you improve and enhance your resume. Get personalized suggestions for quality improvement and error correction in your resume.`,
      lineColor: "border-t-purple-500",
    },
    {
      id: "03",
      icon: <Download className="size-8 text-emerald-500" />,
      title: t`Download resume`,
      description: t`Check your resume score to ensure it is optimized for ATS, and proceed to download in your preferred resume format.`,
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
            {t`Optimize your resume creation with ResumeUp.AI`}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8">
            {t`Avoid mistakes in your resume, get the perfect format and increase your chances for an interview. With ResumeUp.AI platform based on artificial intelligence, creating a professional resume has never been easier.`}
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
                <div className="mt-8 text-4xl font-bold">{feature.id}</div>
                <div className="mt-6">{feature.icon}</div>
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
