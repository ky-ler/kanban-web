import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { projectsQueryOptions } from "@/api/projects/allProjectsQueryOptions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FolderKanban,
  Users,
  Calendar,
  MoreVertical,
  Settings,
  Archive,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProjectSummary } from "@/types/Project";
import { CreateProjectFormDialog } from "@/components/CreateProjectFormDialog";

export const Route = createFileRoute("/_protected/projects/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(projectsQueryOptions),
  component: ProjectsComponent,
});

function ProjectCard({ project }: { project: ProjectSummary }) {
  const progress =
    project.totalIssues > 0
      ? Math.round((project.doneIssues / project.totalIssues) * 100)
      : 0;

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description || "No description provided"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="bg-secondary h-2 w-full rounded-full">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {/* Stats */}
          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <FolderKanban className="h-3 w-3" />
              <span>{project.totalIssues} tasks</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{project.doneIssues} done</span>
            </div>
          </div>
          {/* Last Activity */}
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            <span>
              Updated {new Date(project.dateModified).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link
            to="/projects/$projectId"
            params={{ projectId: String(project.id) }}
          >
            Open Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProjectsComponent() {
  const projectsQuery = useQuery(projectsQueryOptions);
  const projects: ProjectSummary[] = projectsQuery.data || [];

  if (projectsQuery.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and collaborate on your projects
          </p>
        </div>
        <CreateProjectFormDialog
          trigger={<Button variant="outline">Create New Project</Button>}
        />
      </div>

      <Separator />

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <FolderKanban className="text-muted-foreground mb-4 h-16 w-16" />
          <h3 className="mb-2 text-xl font-semibold">No projects yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by creating your first project. You can invite team
            members and start organizing your work.
          </p>
          <CreateProjectFormDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {projects.length > 0 && (
        <div className="mt-8">
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-primary text-2xl font-bold">
                  {projects.length}
                </div>
                <p className="text-muted-foreground text-sm">Total Projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {projects.reduce((acc, p) => acc + p.totalIssues, 0)}
                </div>
                <p className="text-muted-foreground text-sm">Total Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {projects.reduce((acc, p) => acc + p.doneIssues, 0)}
                </div>
                <p className="text-muted-foreground text-sm">Tasks Completed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
