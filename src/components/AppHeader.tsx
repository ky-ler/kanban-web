import { Link } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FolderKanban, Home, Settings } from "lucide-react";

export function AppHeader() {
  const auth = useAuth();

  return (
    <>
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <FolderKanban className="h-6 w-6" />
              <span>Kanban</span>
            </Link>

            {/* Navigation Menu */}
            {auth.isAuthenticated && (
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {/* Main Navigation */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/"
                        className="flex flex-row items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                      >
                        <Home className="h-4 w-4 inline" />
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Projects with Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4" />
                      Projects
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-64 gap-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/projects">
                              <div className="text-sm font-medium leading-none">
                                All Projects
                              </div>
                              <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                View and manage all your projects.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/projects/create">
                              <div className="text-sm font-medium leading-none">
                                Create Project
                              </div>
                              <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                Start a new project.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/projects/create">
                              <div className="text-sm font-medium leading-none">
                                My Tasks
                              </div>
                              <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                View all issues assigned to you.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Settings */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/settings"
                        className="flex flex-row items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-4">
            {auth.isAuthenticated && (
              <>
                <div className="text-sm text-muted-foreground">
                  Welcome,{" "}
                  {auth.user?.profile?.name ||
                    auth.user?.profile?.preferred_username}
                </div>
              </>
            )}

            {auth.isAuthenticated ? (
              <Button variant="outline" onClick={() => auth.signoutRedirect()}>
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => auth.signinRedirect()}>Log In</Button>
            )}
          </div>
        </div>
      </header>
      <Separator />
    </>
  );
}
