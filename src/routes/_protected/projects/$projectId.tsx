import { projectQueryOptions } from "@/api/projects/projectQueryOptions";
import IssueCard from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { STATUSES } from "@/types/Issue";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

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

  console.log(project.issues);

  // filter issues by status
  const backlogIssues = project.issues.filter(
    (issue) => issue.status.name === STATUSES[0]
  );
  const todoIssues = project.issues.filter(
    (issue) => issue.status.name === STATUSES[1]
  );
  const inProgressIssues = project.issues.filter(
    (issue) => issue.status.name === STATUSES[2]
  );
  const completeIssues = project.issues.filter(
    (issue) => issue.status.name === STATUSES[3]
  );
  const canceledIssues = project.issues.filter(
    (issue) => issue.status.name === STATUSES[4]
  );

  console.log(backlogIssues);
  console.log(todoIssues);
  console.log(inProgressIssues);
  console.log(completeIssues);
  console.log(canceledIssues);

  return (
    <>
      <div className="flex flex-col gap-4 flex-1 w-full px-2">
        <div className="flex gap-4 justify-around">
          <div className="flex flex-col gap-2">
            <h1>{project.name}</h1>
            <div>{project.description}</div>

            <Button asChild>
              <Link
                to={"/projects/$projectId/edit"}
                params={{ projectId }}
                from={Route.fullPath}
                viewTransition={{ types: ["cross-fade"] }}
              >
                Edit Project Info
              </Link>
            </Button>

            <Button asChild>
              <Link
                to={"/projects/$projectId/issue/create"}
                params={{ projectId }}
                from={Route.fullPath}
              >
                Create Issue
              </Link>
            </Button>
          </div>

          <div>
            <h2>Collaborators</h2>
            <hr />
            <ul>
              {project.collaborators.map((collaborator) => (
                <li key={collaborator.user.id}>
                  {collaborator.user.username} ({collaborator.user.email})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-evenly w-full">
          <div className="flex flex-col gap-2 w-full">
            <h2>Backlog</h2>
            {backlogIssues.length > 0 &&
              backlogIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} projectId={projectId} />
              ))}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h2>Todo</h2>
            {todoIssues.length > 0 &&
              todoIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} projectId={projectId} />
              ))}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h2>In Progress</h2>
            {inProgressIssues.length > 0 &&
              inProgressIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} projectId={projectId} />
              ))}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h2>Complete</h2>
            {completeIssues.length > 0 &&
              completeIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} projectId={projectId} />
              ))}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h2>Canceled</h2>
            {canceledIssues.length > 0 &&
              canceledIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} projectId={projectId} />
              ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
