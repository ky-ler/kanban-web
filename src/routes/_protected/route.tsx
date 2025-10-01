// import { Button } from "@/components/ui/button";
import {
  createFileRoute,
  // Link,
  Outlet,
  redirect,
  // useRouter,
} from "@tanstack/react-router";
// import { useAuth } from "react-oidc-context";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.isAuthenticated && !context.auth.isLoading) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
