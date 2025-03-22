import { t } from "@lingui/macro";
import { templatesList } from "@reactive-resume/utils";
import { motion } from "framer-motion";

export const TemplatesSection = () => (
  <section id="sample-resumes" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-12">
      <motion.div
        className="text-center"
        viewport={{ once: true }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t`Resume Templates`}</h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8">
          {t`Explore the templates available in our editor and browse through example resumes created with them. They can inspire you and guide you in crafting your perfect resume.`}
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mt-16 w-full overflow-hidden"
        viewport={{ once: true }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{
            x: [0, templatesList.length * 200 * -1],
            transition: {
              x: {
                duration: 30,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
              },
            },
          }}
          className="flex items-center gap-x-6"
        >
          {templatesList.map((template, index) => (
            <motion.a
              key={index}
              target="_blank"
              rel="noreferrer"
              href={`templates/pdf/${template}.pdf`}
              className="max-w-none flex-none"
              viewport={{ once: true }}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <img
                alt={template}
                loading="lazy"
                src={`/templates/jpg/${template}.jpg`}
                className="aspect-[1/1.4142] h-[280px] rounded object-cover lg:h-[420px]"
              />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);
