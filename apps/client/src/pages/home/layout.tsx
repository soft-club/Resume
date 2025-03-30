import { ScrollArea } from "@reactive-resume/ui";
import { lazy, memo, Suspense } from "react";
import { Outlet } from "react-router";

// Мемоизированные компоненты
const Header = lazy(() => import("./components/header").then((m) => ({ default: memo(m.Header) })));
const Footer = lazy(() => import("./components/footer").then((m) => ({ default: memo(m.Footer) })));

// Улучшенный лоадер для основного контента
const MainLoader = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-primary-foreground opacity-75 blur-sm"></div>
      <div className="size-14 animate-spin rounded-full border-b-2 border-l-2 border-primary"></div>
      <div className="absolute left-0 top-0 size-full animate-pulse rounded-full bg-primary/10"></div>
    </div>
  </div>
);

// Улучшенный скелетон для хедера
const HeaderSkeleton = () => (
  <div className="border-b border-border/5 bg-background/80 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="bg-muted/20 h-7 w-36 animate-pulse rounded-md"></div>
      <div className="flex space-x-4">
        <div className="bg-muted/20 h-9 w-24 animate-pulse rounded-md"></div>
        <div className="bg-muted/20 h-9 w-24 animate-pulse rounded-md"></div>
      </div>
    </div>
  </div>
);

// Улучшенный скелетон для футера
const FooterSkeleton = () => (
  <div className="border-t border-border/5 bg-background/80">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="bg-muted/20 h-5 w-24 animate-pulse rounded"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="bg-muted/10 h-4 w-full max-w-[120px] animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const HomeLayout = memo(() => (
  <div className="flex min-h-screen flex-col bg-background">
    <Suspense fallback={<HeaderSkeleton />}>
      <Header />
    </Suspense>

    <ScrollArea orientation="vertical" className="flex-1">
      <Suspense fallback={<MainLoader />}>
        <Outlet />
      </Suspense>
    </ScrollArea>

    <Suspense fallback={<FooterSkeleton />}>
      <Footer />
    </Suspense>
  </div>
));
