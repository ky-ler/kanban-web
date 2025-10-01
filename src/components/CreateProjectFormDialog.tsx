import { useState } from "react";
import { z } from "zod";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { allProjectsQueryKey } from "@/lib/query";
import { createProject } from "@/api/projects/projects";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <span className="text-xs text-destructive">
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </span>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const schema = z.object({
  name: z
    .string()
    .min(3, "Project name is required")
    .max(100, "Project name is too long"),
  description: z.string(),
});

export function CreateProjectFormDialog({
  trigger,
  onCreated,
}: {
  trigger?: React.ReactNode;
  onCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      await createProject(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allProjectsQueryKey });
      setOpen(false);
      onCreated?.();
    },
  });

  const form = useForm({
    defaultValues: { name: "", description: "" },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await createProjectMutation.mutateAsync(value);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start a new project and invite your team to collaborate.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <form.Field
                name="name"
                children={(field) => (
                  <>
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter project name..."
                      required
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              />
            </div>
            <div className="grid gap-2">
              <form.Field
                name="description"
                children={(field) => (
                  <>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Describe your project..."
                      rows={3}
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
