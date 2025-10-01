import { createFileRoute } from "@tanstack/react-router";
import { projectQueryOptions } from "@/api/projects/projectQueryOptions";
import { updateProject } from "@/api/projects/projects";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import type { ProjectForm } from "@/types/ProjectForms";
import { queryClient } from "@/lib/query";
import { useAppForm } from "@/components/ui/tanstack-form";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
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
import { projectQueryKey } from "@/lib/query";

export const Route = createFileRoute("/_protected/projects/$projectId/edit")({
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient.ensureQueryData(projectQueryOptions(projectId)),
  component: EditProjectComponent,
});

// TODO: Refactor to use Tanstack form and zod like CreateProjectFormDialog
function EditProjectComponent() {
  // const project: Project = Route.useLoaderData();
  const projectId = Route.useParams().projectId;
  const { data: project } = useSuspenseQuery(projectQueryOptions(projectId));

  const saveUserMutation = useMutation({
    mutationFn: async (value: {
      projectName: string;
      projectDescription: string;
    }) => {
      const updateProjectData: ProjectForm = {
        projectId: parseInt(projectId),
        name: value.projectName,
        description: value.projectDescription ?? "",
      };
      return await updateProject(updateProjectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
      returnToProject();
    },
  });

  const form = useAppForm({
    defaultValues: {
      projectName: project!.name,
      projectDescription: project!.description ?? "",
    },
    onSubmit: async ({ formApi, value }) => {
      await saveUserMutation.mutateAsync(value);
      await queryClient.invalidateQueries({
        queryKey: projectQueryKey(projectId),
      });

      formApi.reset();
      formApi.setFieldValue("projectName", project!.name);
      formApi.setFieldValue("projectDescription", project!.description ?? "");
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      console.log("form submitted");

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

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        returnToProject();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit project info</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form.AppForm>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid flex-1 gap-2">
                <form.AppField
                  name="projectName"
                  validators={{
                    onChange: ({ value }) => {
                      let error;
                      if (!value) {
                        error = "A project name is required";
                      } else if (value.length < 3) {
                        error = "Project name must be at least 3 characters";
                      } else {
                        error = undefined;
                      }
                      return error;
                    },
                    onChangeAsyncDebounceMs: 50,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return (
                        value.includes("error") &&
                        'No "error" allowed in project name'
                      );
                    },
                  }}
                >
                  {(field) => {
                    return (
                      <field.FormItem>
                        <field.FormLabel htmlFor={field.name}>
                          Project Name
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Project Name"
                          />
                        </field.FormControl>
                      </field.FormItem>
                    );
                  }}
                </form.AppField>
              </div>
              <div className="grid flex-1 gap-2">
                <form.AppField name="projectDescription">
                  {(field) => (
                    <>
                      <field.FormLabel htmlFor={field.name}>
                        Description
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="About this project..."
                        />
                      </field.FormControl>
                    </>
                  )}
                </form.AppField>
              </div>
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
                    {isSubmitting ? "..." : "Save Changes"}
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
