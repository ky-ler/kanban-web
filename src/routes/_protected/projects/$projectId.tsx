import { projectQueryOptions } from "@/api/projects/projectQueryOptions";
import IssueCard from "@/components/IssueCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STATUSES } from "@/types/Issue";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Calendar, Edit, Plus, Users } from "lucide-react";

export const Route = createFileRoute("/_protected/projects/$projectId")({
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient.ensureQueryData(projectQueryOptions(projectId)),
  component: ProjectComponent,
});

function ProjectComponent() {
  const projectId = Route.useParams().projectId;
  const { data: project } = useSuspenseQuery(projectQueryOptions(projectId));

  if (!project) {
    return <div>Loading...</div>;
  }

  // filter issues by status, and sort by priority (high to low)
  const backlogIssues = project.issues
    .filter((issue) => issue.status.name === STATUSES[0])
    .sort((a, b) => b.priority.id - a.priority.id);
  const todoIssues = project.issues
    .filter((issue) => issue.status.name === STATUSES[1])
    .sort((a, b) => b.priority.id - a.priority.id);
  const inProgressIssues = project.issues
    .filter((issue) => issue.status.name === STATUSES[2])
    .sort((a, b) => b.priority.id - a.priority.id);
  const doneIssues = project.issues
    .filter((issue) => issue.status.name === STATUSES[3])
    .sort((a, b) => b.priority.id - a.priority.id);
  const canceledIssues = project.issues
    .filter((issue) => issue.status.name === STATUSES[4])
    .sort((a, b) => b.priority.id - a.priority.id);

  return (
    <>
      <div className="flex flex-col gap-6 flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {/* Project Header */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Project Info */}
            <Card className="flex-1 justify-center">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {project.name}
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                      {project.description || "No description provided"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to={"/projects/$projectId/edit"}
                        params={{ projectId }}
                        from={Route.fullPath}
                        viewTransition={{ types: ["cross-fade"] }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Project
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link
                        to={"/projects/$projectId/issue/create"}
                        params={{ projectId }}
                        from={Route.fullPath}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Issue
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Collaborators */}
            <Card className="lg:w-80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaborators
                  <Badge variant="secondary" className="ml-auto">
                    {project.collaborators.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {project.collaborators.length} team member
                  {project.collaborators.length !== 1 ? "s" : ""} working on
                  this project
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    to={"/projects/$projectId/collaborators"}
                    params={{ projectId }}
                    from={Route.fullPath}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View All Collaborators
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {backlogIssues.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Backlog</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {todoIssues.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Todo</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {inProgressIssues.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    In Progress
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {doneIssues.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Done</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {canceledIssues.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Canceled</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Kanban Board */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kanban Board
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 min-h-[400px]">
            {/* Backlog Column */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    Backlog
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {backlogIssues.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {backlogIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    projectId={projectId}
                  />
                ))}
                {backlogIssues.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No backlog items
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Todo Column */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Todo
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {todoIssues.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {todoIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    projectId={projectId}
                  />
                ))}
                {todoIssues.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No todo items
                  </div>
                )}
              </CardContent>
            </Card>

            {/* In Progress Column */}
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    In Progress
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {inProgressIssues.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {inProgressIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    projectId={projectId}
                  />
                ))}
                {inProgressIssues.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No items in progress
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Done Column */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Done
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {doneIssues.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {doneIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    projectId={projectId}
                  />
                ))}
                {doneIssues.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No done items
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Canceled Column */}
            <Card className="border-gray-200 bg-gray-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    Canceled
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {canceledIssues.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {canceledIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    projectId={projectId}
                  />
                ))}
                {canceledIssues.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No canceled items
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
