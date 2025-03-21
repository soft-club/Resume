import { t } from "@lingui/macro";
import { Button } from "@reactive-resume/ui";
import { motion } from "framer-motion";
import { Link } from "react-router";

import { Logo } from "@/client/components/logo";
import { useAuthStore } from "@/client/stores/auth";
import { UserOptions } from "@/client/components/user-options";
import { UserAvatar } from "@/client/components/user-avatar";
import { useUser } from "@/client/services/user";

export const Header = () => {
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const { user } = useUser();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-20"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.3 } }}
    >
      <div className="bg-gradient-to-b from-background to-transparent py-3">
        <div className="container flex items-center justify-between">
          <Link to="/">
            <Logo size={48} />
          </Link>

          <div className="flex items-center gap-x-4">
            {!isLoggedIn && (
              <Button asChild variant="ghost">
                <Link to="/auth/login">{t`Sign In`}</Link>
              </Button>
            )}
            {isLoggedIn ? (
              <UserOptions>
                <Button size="lg" variant="ghost" className="justify-start px-3">
                  <UserAvatar size={24} className="mr-3" />
                  <span>{user?.name}</span>
                </Button>
              </UserOptions>
            ) : (
              <Button asChild>
                <Link to="/auth/register">{t`Get Started`}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
