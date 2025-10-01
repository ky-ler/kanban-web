import { projectQueryOptions } from "@/api/projects/projectQueryOptions";
import { removeCollaborator } from "@/api/projects/projects";
import { ROLES } from "@/types/Collaborator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { router } from "@/lib/router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, User, UserMinus, Shield, Users } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { queryClient } from "@/lib/query";
import { projectQueryKey } from "@/lib/query";

export const Route = createFileRoute(
  "/_protected/projects/$projectId/collaborators"
)({
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient.ensureQueryData(projectQueryOptions(projectId)),
  component: CollaboratorsComponent,
});

// TODO: Add ability to add and change roles of collaborators
function CollaboratorsComponent() {
  const { projectId } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQueryOptions(projectId));
  const auth = useAuth();

  const currentUserId = auth?.user?.profile.sub;

  // Find current user's role in the project
  const currentUserRole = project?.collaborators.find(
    (collaborator) => collaborator.user.id.toString() === currentUserId
  )?.role;

  const isCurrentUserAdmin = currentUserRole === "ADMIN";

  const removeCollaboratorMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      removeCollaborator(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
    },
    onError: (error) => {
      console.error("Failed to remove collaborator:", error);
      // TODO: Add a toast notification here
      alert("Failed to remove collaborator. Please try again.");
    },
  });

  const handleRemoveCollaborator = (userId: number) => {
    if (window.confirm("Are you sure you want to remove this collaborator?")) {
      removeCollaboratorMutation.mutate({ userId: userId.toString() });
    }
  };

  const returnToProject = () => {
    // Navigate back to the project page
    router.navigate({ to: "/projects/$projectId", params: { projectId } });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case ROLES[0]:
      case "ADMIN":
        return <Shield className="h-3 w-3" />;
      case ROLES[1]:
      case "MEMBER":
        return <Users className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case ROLES[0]:
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case ROLES[1]:
      case "MEMBER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRolePriority = (role: string) => {
    return ROLES.indexOf(role);
  };

  // Sort collaborators by role priority (ADMIN first, then MEMBER, then GUEST)
  const sortedCollaborators =
    project?.collaborators.slice().sort((a, b) => {
      return getRolePriority(a.role) - getRolePriority(b.role);
    }) || [];

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        returnToProject();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Project Collaborators
          </DialogTitle>
          <DialogDescription>
            Team members working on {project.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedCollaborators.map((collaborator) => (
            <div
              key={collaborator.user.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">
                    {collaborator.user.username}
                  </h4>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      collaborator.role
                    )}`}
                  >
                    {getRoleIcon(collaborator.role)}
                    {collaborator.role}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {collaborator.user.email}
                </div>
              </div>
              {isCurrentUserAdmin &&
                collaborator.user.id.toString() !== currentUserId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleRemoveCollaborator(collaborator.user.id)
                    }
                    disabled={removeCollaboratorMutation.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <UserMinus className="h-4 w-4" />
                    {removeCollaboratorMutation.isPending
                      ? "Removing..."
                      : "Remove"}
                  </Button>
                )}
            </div>
          ))}

          {sortedCollaborators.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No collaborators found
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
