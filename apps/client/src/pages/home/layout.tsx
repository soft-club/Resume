import { lazy, memo, Suspense } from "react";
import { Outlet } from "react-router";
import { ScrollArea } from "@reactive-resume/ui";

// Мемоизированные компоненты
const Header = lazy(() => import("./components/header").then((m) => ({ default: memo(m.Header) })));
const Footer = lazy(() => import("./components/footer").then((m) => ({ default: memo(m.Footer) })));

// Лоадер для основного контента
const MainLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

export const HomeLayout = memo(() => (
  <ScrollArea orientation="vertical" className="h-screen">
    <Suspense fallback={<div className="bg-muted/20 h-16 animate-pulse" />}>
      <Header />
    </Suspense>

    <Suspense fallback={<MainLoader />}>
      <Outlet />
    </Suspense>

    <Suspense fallback={<div className="bg-muted/20 h-32 animate-pulse" />}>
      <Footer />
    </Suspense>
  </ScrollArea>
));
