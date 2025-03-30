import { t } from "@lingui/macro";
import { Button } from "@reactive-resume/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Logo } from "@/client/components/logo";
import { UserAvatar } from "@/client/components/user-avatar";
import { UserOptions } from "@/client/components/user-options";
import { useUser } from "@/client/services/user";
import { useAuthStore } from "@/client/stores/auth";

export const Header = () => {
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Отслеживание прокрутки для изменения фона хедера
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.3 } }}
    >
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 shadow-sm backdrop-blur-md"
            : "bg-background/40 backdrop-blur-sm"
        }`}
      >
        <div className="container flex h-20 items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={36} />
            <div className="hidden flex-col md:flex">
              <span className="text-xl font-bold text-foreground">{t`CV Portfolio`}</span>
              <span className="text-muted-foreground text-xs">cvport.uz</span>
            </div>
          </Link>

          {/* Навигация для десктопа */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/#features"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {t`Features`}
            </Link>
            <Link
              to="/#templates"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {t`Templates`}
            </Link>
            <Link
              to="/#pricing"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {t`Pricing`}
            </Link>
          </nav>

          {/* Кнопки для десктопа */}
          <div className="hidden items-center gap-x-3 md:flex">
            {!isLoggedIn && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-10 rounded-full px-6 py-0 font-medium transition-colors"
              >
                <Link to="/auth/login">{t`Sign In`}</Link>
              </Button>
            )}
            {isLoggedIn ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-full px-6 py-0 font-medium transition-colors"
                >
                  <Link to="/dashboard">{t`Dashboard`}</Link>
                </Button>
                <UserOptions>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 justify-start rounded-full px-4 py-0"
                  >
                    <UserAvatar size={24} className="mr-2" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Button>
                </UserOptions>
              </>
            ) : (
              <Button
                asChild
                size="sm"
                className="h-10 rounded-full bg-gradient-to-r from-primary to-primary-foreground px-6 py-0 font-medium text-white shadow-md transition-all hover:shadow-lg"
              >
                <Link to="/auth/register">{t`Get Started`}</Link>
              </Button>
            )}
          </div>

          {/* Кнопка мобильного меню */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? t`Close menu` : t`Open menu`}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">{mobileMenuOpen ? t`Close menu` : t`Open menu`}</span>
            {mobileMenuOpen ? (
              <svg
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="absolute inset-x-0 top-20 z-40 border-b border-border/20 bg-background/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container space-y-1 px-2 pb-3 pt-2">
              <Link
                to="/#features"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10"
                onClick={() => {
                  handleCloseMenu();
                }}
              >
                {t`Features`}
              </Link>
              <Link
                to="/#templates"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10"
                onClick={() => {
                  handleCloseMenu();
                }}
              >
                {t`Templates`}
              </Link>
              <Link
                to="/#pricing"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10"
                onClick={() => {
                  handleCloseMenu();
                }}
              >
                {t`Pricing`}
              </Link>

              <div className="mt-4 flex flex-col space-y-2 border-t border-border/20 pt-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10"
                      onClick={() => {
                        handleCloseMenu();
                      }}
                    >
                      {t`Dashboard`}
                    </Link>
                    <div className="flex items-center gap-2 rounded-md px-3 py-2">
                      <UserAvatar size={24} />
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10"
                      onClick={() => {
                        handleCloseMenu();
                      }}
                    >
                      {t`Sign In`}
                    </Link>
                    <Link
                      to="/auth/register"
                      className="block rounded-md bg-gradient-to-r from-primary to-primary-foreground px-3 py-2 text-base font-medium text-white hover:bg-primary/90"
                      onClick={() => {
                        handleCloseMenu();
                      }}
                    >
                      {t`Get Started`}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
