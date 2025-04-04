import { t } from "@lingui/macro";
import { Trans } from "@lingui/macro";
import { Separator } from "@reactive-resume/ui";
import { motion } from "framer-motion";
import { Link } from "react-router";

import { LocaleSwitch } from "@/client/components/locale-switch";
import { Logo } from "@/client/components/logo";
import { ThemeSwitch } from "@/client/components/theme-switch";

// Анимация для элементов
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Типы для props иконок
type IconProps = React.SVGProps<SVGSVGElement>;

// Навигационные ссылки
const getNavigation = () => ({
  product: [
    { name: t`Features`, href: "/#features" },
    { name: t`Templates`, href: "/#templates" },
    { name: t`Pricing`, href: "/#pricing" },
    { name: t`FAQ`, href: "/#faq" },
  ],
  resources: [
    { name: t`Documentation`, href: "/#" },
    { name: t`API`, href: "/#" },
    { name: t`Privacy Policy`, href: "/meta/privacy-policy" },
    { name: t`Terms of Service`, href: "/meta/terms-of-service" },
  ],
  social: [
    {
      name: t`GitHub`,
      href: "https://github.com/reactive-resume/reactive-resume",
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: t`Twitter`,
      href: "https://twitter.com/reactiveresumeio",
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
  ],
});

export const Footer = () => {
  // Получаем навигацию внутри компонента для правильной работы с переводами
  const navigation = getNavigation();
   
  // Акцентные цвета для UI - объявляем внутри функции из-за требований лингвиста
  const accentGradient = t`from-indigo-600 to-violet-600`;
  const secondaryGradient = t`from-rose-500 to-orange-500`;

  return (
    <footer className="bg-background" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        {t`Footer`}
      </h2>

      <Separator />

      <div className="container py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <motion.div
            className="space-y-8 xl:col-span-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <div className="relative">
                  <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${accentGradient} blur-sm opacity-70`}></div>
                  <div className="relative">
                    <Logo size={48} />
                  </div>
                </div>
                <span className="ml-2 text-2xl font-bold">
                  <span className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
                    <Trans>CV</Trans>
                  </span> <Trans>Portfolio</Trans>
                </span>
              </div>
              <a
                href="https://cvport.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                cvport.uz
              </a>
            </div>
            <p className="max-w-xs text-base text-foreground/70">
              {t`A free and open-source resume builder that simplifies the process of creating, updating, and sharing your resume.`}
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="transition-transform hover:scale-110 hover:text-indigo-600 dark:hover:text-indigo-400"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="size-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  {t`Product`}
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-foreground/70 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  {t`Resources`}
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-foreground/70 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  {t`Join our newsletter`}
                </h3>
                <p className="mt-4 text-base text-foreground/70">
                  {t`Stay updated with the latest features, templates, and news.`}
                </p>
                <div className="mt-4 flex lg:max-w-md">
                  <input
                    required
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    placeholder={t`Enter your email`}
                    className="w-full min-w-0 flex-1 rounded-l-md border border-border bg-background px-4 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-r-md border border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-base font-medium text-white shadow-sm transition-all hover:shadow-md hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {t`Subscribe`}
                  </button>
                </div>
              </div>
              <div className="mt-12 flex items-center justify-start space-x-4 md:mt-8">
                <LocaleSwitch />
                <ThemeSwitch />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-base text-foreground/70">
              &copy; {new Date().getFullYear()} <Trans>CV Portfolio</Trans>.{" "}
              {t`All rights reserved.`}
            </p>
            <p className="mt-2 text-sm text-foreground/70 md:mt-0">
              <Trans>
                Made with <span role="img" aria-label="heart">❤️</span> in <span className={`bg-gradient-to-r ${secondaryGradient} bg-clip-text font-medium text-transparent`}>Uzbekistan</span>
              </Trans>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
