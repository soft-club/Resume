import { t, Trans } from "@lingui/macro";
import { buttonVariants } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { motion } from "framer-motion";

type LogoProps = {
  company: string;
  index: number;
};

const Logo = ({ company, index }: LogoProps) => (
  <motion.div
    className={cn(
      "group relative col-span-2 col-start-2 sm:col-start-auto lg:col-span-1",
      company === "twilio" && "sm:col-start-2",
    )}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <div className="absolute -inset-2 rounded-lg bg-foreground/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    {/* Show on Light Theme */}
    <img
      className="relative block max-h-12 object-contain transition-all duration-300 group-hover:brightness-110 dark:hidden"
      src={`/brand-logos/dark/${company}.svg`}
      alt={company}
      width={212}
      height={48}
    />
    {/* Show on Dark Theme */}
    <img
      className="relative hidden max-h-12 object-contain transition-all duration-300 group-hover:brightness-125 dark:block"
      src={`/brand-logos/light/${company}.svg`}
      alt={company}
      width={212}
      height={48}
    />
  </motion.div>
);

const logoList: string[] = ["amazon", "google", "postman", "twilio", "zalando"];

export const LogoCloudSection = () => (
  <section id="logo-cloud" className="relative overflow-hidden py-24 sm:py-32">
    {/* Декоративный элемент на фоне */}
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_50%,rgba(var(--foreground-rgb),0.05),rgba(var(--background-rgb),0))]" />

    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <motion.div
        className="mx-auto max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto inline-block text-center">
          <p className="inline-flex items-center rounded-full border border-foreground/10 bg-background px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm dark:bg-background/30">
            <span className="mr-2 flex size-2 rounded-full bg-primary"></span>
            <span className="text-foreground/80">{t`Trusted by professionals`}</span>
          </p>
        </div>
        <p className="mt-5 text-center text-lg leading-relaxed">
          {t`Reactive Resume has helped people land jobs at these great companies:`}
        </p>
      </motion.div>

      <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
        {logoList.map((company, index) => (
          <Logo key={company} company={company} index={index} />
        ))}
      </div>

      <motion.div
        className="mx-auto mt-10 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <p className="rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-center leading-relaxed shadow-sm">
          <Trans>
            If this app has helped you with your job hunt, let me know by reaching out through{" "}
            <a
              target="_blank"
              rel="noopener noreferrer nofollow"
              href="https://www.amruthpillai.com/#contact"
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 font-medium text-primary hover:text-primary/80",
              )}
            >
              this contact form
            </a>
            .
          </Trans>
        </p>
      </motion.div>
    </div>
  </section>
);
