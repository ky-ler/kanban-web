import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type AnyFieldApi } from "@tanstack/react-form";
import { api } from "@/api/api";
import { fetchProjects } from "@/api/projects/projects";
import { projectsQueryOptions } from "@/api/projects/projectsQueryOptions";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/tanstack-form";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import type { ProjectForm } from "@/types/ProjectForms";

export const Route = createFileRoute("/_protected/projects/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(projectsQueryOptions),
  component: PostsLayoutComponent,
});

function FieldInfo({ field }: Readonly<{ field: AnyFieldApi }>) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

// TODO: this is a temporary solution, we need to create a proper form for creating projects
function PostsLayoutComponent() {
  const queryClient = useQueryClient();
  const projectsQuery = useQuery(projectsQueryOptions);
  const projects = projectsQuery.data;

  const saveUserMutation = useMutation({
    mutationFn: async (value: {
      projectName: string;
      projectDescription: string;
    }) => {
      const postData: ProjectForm = {
        name: value.projectName,
        description: value.projectDescription,
      };
      await api.post("/projects", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const form = useAppForm({
    defaultValues: {
      projectName: "",
      projectDescription: "",
    },
    onSubmit: async ({ formApi, value }) => {
      await saveUserMutation.mutateAsync(value);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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

  return (
    <div className="p-2 flex justify-around gap-8">
      <div>
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                onChangeAsyncDebounceMs: 500,
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
                      Project Name:
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
                    <FieldInfo field={field} />
                  </field.FormItem>
                );
              }}
            </form.AppField>
            <form.AppField name="projectDescription">
              {(field) => (
                <>
                  <field.FormLabel htmlFor={field.name}>
                    Description:
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

                  <FieldInfo field={field} />
                </>
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
                  <Button
                    variant={"destructive"}
                    type="reset"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                </>
              )}
            </form.Subscribe>
          </form>
        </form.AppForm>
      </div>

      <div>
        <Button onClick={() => fetchProjects()}>Get My Projects</Button>

        <div className="flex flex-col gap-2">
          {projects?.map((project) => (
            <Button variant={"link"} key={project.id} asChild>
              <Link
                to={"/projects/$projectId"}
                params={{ projectId: String(project.id) }}
              >
                {project.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
