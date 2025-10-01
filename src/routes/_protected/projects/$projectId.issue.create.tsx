import { createIssue } from "@/api/issues/issues";
import { projectQueryKey } from "@/lib/query";
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
import { queryClient } from "@/lib/query";
import { router } from "@/lib/router";
import { PRIORITIES, STATUSES, type IssueRequestData } from "@/types/Issue";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute(
  "/_protected/projects/$projectId/issue/create",
)({
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient.ensureQueryData(projectQueryOptions(projectId)),
  component: CreateIssueComponent,
});

// TODO: Refactor to use Tanstack form and zod like CreateProjectFormDialog
function CreateIssueComponent() {
  const projectId = Route.useParams().projectId;
  const { data: project } = useSuspenseQuery(projectQueryOptions(projectId));

  const saveUserMutation = useMutation({
    mutationFn: async (value: {
      issueTitle: string;
      issueDescription: string;
      issuePriorityName: string;
      issueStatusName: string;
      issueAssignee: string | null;
    }) => {
      const createIssueData: IssueRequestData = {
        projectId: Number(projectId),
        title: value.issueTitle,
        description: value.issueDescription ?? null,
        statusName: value.issueStatusName,
        priorityName: value.issuePriorityName,
        assignedToUsername:
          value.issueAssignee == "" ? null : value.issueAssignee,
      };

      await createIssue(createIssueData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
      returnToProject();
    },
  });

  const form = useAppForm({
    defaultValues: {
      issueTitle: "",
      issueDescription: "",
      issuePriorityName: PRIORITIES[0],
      issueStatusName: STATUSES[0],
      issueAssignee: "",
    },
    onSubmit: async ({ formApi, value }) => {
      await saveUserMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Create a new issue for this project. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
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
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return (
                      value.includes("error") &&
                      'No "error" allowed in issue title'
                    );
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
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return (
                      value.includes("error") &&
                      'No "error" allowed in issue status'
                    );
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
                        <SelectTrigger className="w-[180px]">
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
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return (
                      value.includes("error") &&
                      'No "error" allowed in issue status'
                    );
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
                        <SelectTrigger className="w-[180px]">
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
                    // check if value is the username of a collaborator
                    if (value) {
                      const collaborator = project?.collaborators.find(
                        (collaborator) => collaborator.user.username === value,
                      );
                      if (!collaborator) {
                        error = "Invalid assignee";
                      }
                    } else {
                      error = undefined;
                    }
                    return error;
                  },
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return (
                      value.includes("error") &&
                      'No "error" allowed in issue assignee'
                    );
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
                        <SelectTrigger className="w-[180px]">
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
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Create Issue"}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
