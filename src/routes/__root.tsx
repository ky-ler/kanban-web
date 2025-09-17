import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Button } from "@/components/ui/button";
import type { RouterContext } from "@/lib/router";
import { Separator } from "@/components/ui/separator";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <RootComponent />,
});

function RootComponent() {
  const auth = useAuth();

  return (
    <>
      <header>
        <div className="p-2 flex gap-2 items-center justify-around">
          <div className="flex gap-2">
            <Button variant={"link"} asChild>
              <Link to="/" className="[&.active]:font-bold">
                Home
              </Link>
            </Button>
            <Button variant={"link"} asChild>
              <Link to="/about" className="[&.active]:font-bold">
                About
              </Link>
            </Button>
            <Button variant={"link"} asChild>
              <Link to="/projects" className="[&.active]:font-bold">
                Projects
              </Link>
            </Button>
          </div>
          {auth.isAuthenticated ? (
            <Button variant={"link"} onClick={() => auth.signoutRedirect()}>
              Sign Out
            </Button>
          ) : (
            <Button variant={"link"} onClick={() => auth.signinRedirect()}>
              Log In
            </Button>
          )}
        </div>
      </header>
      <Separator />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </>
  );
}
