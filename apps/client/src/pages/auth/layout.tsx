import { Trans } from "@lingui/macro";
import { useMemo } from "react";
import { Link, matchRoutes, Outlet, useLocation } from "react-router";

import { LocaleSwitch } from "@/client/components/locale-switch";
import { Logo } from "@/client/components/logo";
import { ThemeSwitch } from "@/client/components/theme-switch";
import { useAuthProviders } from "@/client/services/auth/providers";

import { SocialAuth } from "./_components/social-auth";

const authRoutes = [{ path: "/auth/login" }, { path: "/auth/register" }];

export const AuthLayout = () => {
  const location = useLocation();
  const { providers } = useAuthProviders();
  const isAuthRoute = useMemo(() => matchRoutes(authRoutes, location) !== null, [location]);

  if (!providers) return null;

  // Condition (providers.length === 1) hides the divider if providers[] includes only "email"
  const hideDivider = !providers.includes("email") || providers.length === 1;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-x-0 -top-10 mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Logo size={40} />
            <span className="text-xl font-bold">
              <Trans>Reactive Resume</Trans>
            </span>
          </Link>

          <div className="space-x-2">
            <LocaleSwitch />
            <ThemeSwitch />
          </div>
        </div>

        <Outlet />

        {isAuthRoute && !hideDivider && (
          <div className="mt-6">
            <SocialAuth />
          </div>
        )}
      </div>
    </div>
  );
};
