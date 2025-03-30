import { t } from "@lingui/macro";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Logo } from "@/client/components/logo";
import { UserAvatar } from "@/client/components/user-avatar";
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

  // Акцентный цвет для бренда
  const accentColor = "from-indigo-600 to-violet-600";
  const secondaryColor = "from-rose-500 to-orange-500";

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
            <div className="relative">
              <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${accentColor} blur-sm opacity-70`}></div>
              <div className="relative">
                <Logo size={36} />
              </div>
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-xl font-bold text-foreground">
                <span className={`bg-gradient-to-r ${accentColor} bg-clip-text text-transparent`}>
                  CV
                </span> Portfolio
              </span>
              <span className="text-xs text-muted-foreground">cvport.uz</span>
            </div>
          </Link>

          {/* Навигация для десктопа */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link 
              to="/#features" 
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-indigo-600"
            >
              {t`Features`}
            </Link>
            <Link 
              to="/#templates" 
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-indigo-600"
            >
              {t`Templates`}
            </Link>
            <Link 
              to="/#pricing" 
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-indigo-600"
            >
              {t`Pricing`}
            </Link>
          </nav>

          {/* Одна кнопка для десктопа */}
          <div className="hidden items-center md:flex">
            {isLoggedIn ? (
              <Link 
                to="/dashboard"
                className="group relative inline-flex h-10 items-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></span>
                <div className="flex items-center">
                  <UserAvatar size={20} className="mr-2" />
                  <span className="text-sm">{user?.name ?? t`Dashboard`}</span>
                </div>
              </Link>
            ) : (
              <Link 
                to="/auth/register"
                className="group relative inline-flex h-10 items-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></span>
                <span className="relative flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t`Get Started`}
                </span>
              </Link>
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
            <span className="sr-only">
              {mobileMenuOpen ? t`Close menu` : t`Open menu`}
            </span>
            {mobileMenuOpen ? (
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/20"
                onClick={() => {
                  handleCloseMenu();
                }}
              >
                {t`Features`}
              </Link>
              <Link 
                to="/#templates" 
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/20"
                onClick={() => {
                  handleCloseMenu();
                }}
              >
                {t`Templates`}
              </Link>
              <Link 
                to="/#pricing" 
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/20"
                onClick={() => {
                  handleCloseMenu();
                }}
              >
                {t`Pricing`}
              </Link>
              
              <div className="mt-4 border-t border-border/20 pt-4">
                {isLoggedIn ? (
                  <Link 
                    to="/dashboard"
                    className="flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-base font-medium text-white"
                    onClick={() => {
                      handleCloseMenu();
                    }}
                  >
                    <UserAvatar size={20} className="mr-2" />
                    <span>{user?.name ?? t`Dashboard`}</span>
                  </Link>
                ) : (
                  <Link 
                    to="/auth/register"
                    className="flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-base font-medium text-white"
                    onClick={() => {
                      handleCloseMenu();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t`Get Started`}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
