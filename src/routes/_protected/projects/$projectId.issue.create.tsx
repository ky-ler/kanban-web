import { api } from "@/api/api";
import { projectQueryOptions } from "@/api/projects/projectQueryOptions";
import { Button } from "@/components/ui/button";
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
import {
  getPriorityId,
  getStatusId,
  PRIORITIES,
  STATUSES,
  type IssueForm,
  type Priority,
  type Status,
} from "@/types/Issue";
import type { Updater } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute(
  "/_protected/projects/$projectId/issue/create"
)({
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient.ensureQueryData(projectQueryOptions(projectId)),
  component: CreateIssueComponent,
});

// TODO: Create a form to create the issue
function CreateIssueComponent() {
  const projectId = Route.useParams().projectId;
  const { data: project } = useSuspenseQuery(projectQueryOptions(projectId));

  console.log(PRIORITIES);
  console.log(STATUSES);
  console.log("create issue page");

  const saveUserMutation = useMutation({
    mutationFn: async (value: {
      issueTitle: string;
      issueDescription: string;
      issuePriority: Priority;
      issueStatus: Status;
      issueAssignee: string | null;
    }) => {
      const createIssueData: IssueForm = {
        projectId: Number(projectId),
        title: value.issueTitle,
        description: value.issueDescription ?? null,
        statusId: getStatusId(value.issueStatus),
        priorityId: getPriorityId(value.issuePriority),
        assignedToUsername: value.issueAssignee ?? null,
      };

      await api.post(`/projects/${projectId}/issues/create`, createIssueData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", { projectId }] });
    },
  });

  const form = useAppForm({
    defaultValues: {
      issueTitle: "",
      issueDescription: "",
      issuePriority: PRIORITIES[0] as Priority,
      issueStatus: STATUSES[0] as Status,
      issueAssignee: "",
    },
    onSubmit: async ({ formApi, value }) => {
      await saveUserMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["projects", { projectId }] });
      formApi.reset();
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Edit Project Info</h2>
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                    Issue Title:
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
                <>
                  <field.FormLabel htmlFor={field.name}>
                    Description:
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
                </>
              )}
            </form.AppField>
            <form.AppField
              name="issueStatus"
              validators={{
                onChange: ({ value }) => {
                  let error;
                  if (getStatusId(value) < 1) {
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
                    Issue Status:
                  </field.FormLabel>
                  <field.FormControl>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as Updater<Status>)
                      }
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
              name="issuePriority"
              validators={{
                onChange: ({ value }) => {
                  let error;
                  if (getPriorityId(value) < 1) {
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
                    Issue Priority:
                  </field.FormLabel>
                  <field.FormControl>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as Updater<Priority>)
                      }
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
                      (collaborator) => collaborator.user.username === value
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
                    Assign To:
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
                          {/* This is a hack to make the unassigned option work */}
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
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <>
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Submit"}
                  </Button>
                  <Button variant={"link"} asChild>
                    <Link
                      to={"/projects/$projectId"}
                      params={{ projectId }}
                      from={Route.fullPath}
                    >
                      Back to Project
                    </Link>
                  </Button>
                </>
              )}
            </form.Subscribe>
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
