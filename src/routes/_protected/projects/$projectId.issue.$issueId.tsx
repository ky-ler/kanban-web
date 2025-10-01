import { useCallback, useState } from "react";
import { issueQueryOptions } from "@/api/issues/issueQueryOptions";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { issueQueryKey, queryClient } from "@/lib/query";
import { router } from "@/lib/router";
import { updateIssue } from "@/api/issues/issues";
import { projectQueryOptions } from "@/api/projects/projectQueryOptions";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITIES, STATUSES, type IssueRequestData } from "@/types/Issue";
import { projectQueryKey } from "@/lib/query";

export const Route = createFileRoute(
  "/_protected/projects/$projectId/issue/$issueId",
)({
  loader: async ({
    context: { queryClient },
    params: { projectId, issueId },
  }) => {
    await Promise.all([
      queryClient.ensureQueryData(projectQueryOptions(projectId)),
      queryClient.ensureQueryData(issueQueryOptions(projectId, issueId)),
    ]);
  },
  component: IssueComponent,
});

// TODO: Refactor to use Tanstack form and zod like CreateProjectFormDialog
function IssueComponent() {
  const { projectId, issueId } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQueryOptions(projectId));
  const { data: issue } = useSuspenseQuery(
    issueQueryOptions(projectId, issueId),
  );

  const [isEditing, setIsEditing] = useState(false);

  const saveIssueMutation = useMutation({
    mutationFn: async (value: {
      issueTitle: string;
      issueDescription: string;
      issuePriorityName: string;
      issueStatusName: string;
      issueAssignee: string | null;
    }) => {
      const updateIssueData: IssueRequestData = {
        projectId: Number(projectId),
        title: value.issueTitle,
        description: value.issueDescription ?? null,
        statusName: value.issueStatusName,
        priorityName: value.issuePriorityName,
        assignedToUsername: value.issueAssignee ?? null,
      };

      await updateIssue(issueId, updateIssueData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: issueQueryKey(projectId, issueId),
      });
      queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
      setIsEditing(false);
    },
  });

  const form = useAppForm({
    defaultValues: {
      issueTitle: issue?.title ?? "",
      issueDescription: issue?.description ?? "",
      issuePriorityName: issue?.priority.name ?? "",
      issueStatusName: issue?.status.name ?? "",
      issueAssignee: issue?.assignedTo?.username ?? "",
    },
    onSubmit: async ({ formApi, value }) => {
      await saveIssueMutation.mutateAsync(value);
      formApi.reset();
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  const returnToProject = () => {
    // Navigate back to the project page
    router.navigate({ to: "/projects/$projectId", params: { projectId } });
  };

  if (!project || !issue) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        returnToProject();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{issue.title}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit issue details"
              : `Issue details for ${project.name}`}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <form.AppField
                  name="issueTitle"
                  validators={{
                    onChange: ({ value }) => {
                      let error;
                      if (!value) {
                        error = "An issue title is required";
                      } else if (value.length < 3) {
                        error = "Issue title must be at least 3 characters";
                      } else {
                        error = undefined;
                      }
                      return error;
                    },
                  }}
                >
                  {(field) => (
                    <field.FormItem>
                      <field.FormLabel htmlFor={field.name}>
                        Issue Title
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Issue Title"
                        />
                      </field.FormControl>
                    </field.FormItem>
                  )}
                </form.AppField>

                <form.AppField name="issueDescription">
                  {(field) => (
                    <field.FormItem>
                      <field.FormLabel htmlFor={field.name}>
                        Description
                      </field.FormLabel>
                      <field.FormControl>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="About this issue..."
                        />
                      </field.FormControl>
                    </field.FormItem>
                  )}
                </form.AppField>

                <form.AppField
                  name="issueStatusName"
                  validators={{
                    onChange: ({ value }) => {
                      let error;
                      if (STATUSES.indexOf(value) < 0) {
                        error = "Invalid status";
                      } else {
                        error = undefined;
                      }
                      return error;
                    },
                  }}
                >
                  {(field) => (
                    <field.FormItem>
                      <field.FormLabel htmlFor={field.name}>
                        Issue Status
                      </field.FormLabel>
                      <field.FormControl>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                    </field.FormItem>
                  )}
                </form.AppField>

                <form.AppField
                  name="issuePriorityName"
                  validators={{
                    onChange: ({ value }) => {
                      let error;
                      if (PRIORITIES.indexOf(value) < 0) {
                        error = "Invalid priority";
                      } else {
                        error = undefined;
                      }
                      return error;
                    },
                  }}
                >
                  {(field) => (
                    <field.FormItem>
                      <field.FormLabel htmlFor={field.name}>
                        Issue Priority
                      </field.FormLabel>
                      <field.FormControl>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITIES.map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                    </field.FormItem>
                  )}
                </form.AppField>

                <form.AppField
                  name="issueAssignee"
                  validators={{
                    onChange: ({ value }) => {
                      let error;
                      if (value) {
                        const collaborator = project?.collaborators.find(
                          (collaborator) =>
                            collaborator.user.username === value,
                        );
                        if (!collaborator) {
                          error = "Invalid assignee";
                        }
                      } else {
                        error = undefined;
                      }
                      return error;
                    },
                  }}
                >
                  {(field) => (
                    <field.FormItem>
                      <field.FormLabel htmlFor={field.name}>
                        Assign To
                      </field.FormLabel>
                      <field.FormControl>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="No Assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null as never} key={undefined}>
                              No Assignee
                            </SelectItem>
                            {project.collaborators.map((collaborator) => (
                              <SelectItem
                                key={collaborator.user.username}
                                value={collaborator.user.username}
                              >
                                {collaborator.user.username}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                    </field.FormItem>
                  )}
                </form.AppField>
              </div>
            </form>
          </form.AppForm>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {issue.status.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Priority
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {issue.priority.name}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {issue.description || "No description provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Assigned To
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {issue.assignedTo?.username || "Unassigned"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Created By
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {issue.createdBy.username}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Created
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(issue.dateCreated)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Modified
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(issue.dateModified)}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Issue</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
