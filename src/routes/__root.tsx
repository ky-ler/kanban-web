import {
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { RouterContext } from "@/lib/router";
import { AppHeader } from "@/components/AppHeader";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <RootComponent />,
});

function RootComponent() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </>
  );
}
