import { routeTree } from "@/routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import type { AuthContextProps } from "react-oidc-context";

const queryClient = new QueryClient();

interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContextProps;
}

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: null as unknown as AuthContextProps,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { router };
export type { RouterContext };
