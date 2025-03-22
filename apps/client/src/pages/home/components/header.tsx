import { t } from "@lingui/macro";
import { Button } from "@reactive-resume/ui";
import { motion } from "framer-motion";
import { Link } from "react-router";

import { Logo } from "@/client/components/logo";
import { UserAvatar } from "@/client/components/user-avatar";
import { UserOptions } from "@/client/components/user-options";
import { useUser } from "@/client/services/user";
import { useAuthStore } from "@/client/stores/auth";

export const Header = () => {
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const { user } = useUser();

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-20"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.3 } }}
    >
      <div className="bg-background/90 backdrop-blur-sm">
        <div className="container flex h-20 items-center justify-between py-3">
          <Link to="/">
            <Logo size={36} />
          </Link>

          <div className="flex items-center gap-x-2">
            {!isLoggedIn && (
              <Button asChild variant="ghost" size="sm" className="h-10 px-3 py-0">
                <Link to="/auth/login">{t`Sign In`}</Link>
              </Button>
            )}
            {isLoggedIn ? (
              <>
                <Button asChild variant="ghost" size="sm" className="h-10 px-3 py-0">
                  <Link to="/dashboard">{t`Dashboard`}</Link>
                </Button>
                <UserOptions>
                  <Button size="sm" variant="ghost" className="h-10 justify-start px-3 py-0">
                    <UserAvatar size={20} className="mr-2" />
                    <span className="text-sm">{user?.name}</span>
                  </Button>
                </UserOptions>
              </>
            ) : (
              <Button asChild size="sm" className="h-10 px-3 py-0">
                <Link to="/auth/register">{t`Get Started`}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
