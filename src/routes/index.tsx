import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) => {
    console.log(context, location);
  },
  component: Index,
});

// TODO: create a cool landing page 👍
function Index() {
  const auth = useAuth();

  return auth.isAuthenticated ? (
    <button onClick={() => auth.signoutRedirect()}>Sign Out</button>
  ) : (
    <button onClick={() => auth.signinRedirect()}>Sign In</button>
  );
}
