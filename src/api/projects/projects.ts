import type { Project, ProjectSummary } from "@/types/Project";
import type { ProjectForm } from "@/types/ProjectForms";
import { apiClient } from "../base-api";

export const fetchProjects = async (): Promise<
  ProjectSummary[] | undefined
> => {
  console.info("Fetching projects...");
  return await apiClient.get<ProjectSummary[]>("projects");
};

export const fetchProject = async (
  projectId: string
): Promise<Project | undefined> => {
  console.info("Fetching info about project: " + projectId);
  return await apiClient.get<Project>(`projects/${projectId}`);
};

export const createProject = async (formData: {
  name: string;
  description?: string;
}): Promise<Project | undefined> => {
  console.info("Creating project: " + formData.name);
  return await apiClient.post<Project>("projects", formData);
};

export const updateProject = async (
  projectForm: ProjectForm
): Promise<Project | undefined> => {
  console.info("Updating project: " + projectForm.projectId);
  return await apiClient.put<Project>(
    `projects/${projectForm.projectId}`,
    projectForm
  );
};

export const deleteProject = async (projectId: string): Promise<void> => {
  console.info("Deleting project: " + projectId);
  return await apiClient.delete<void>(`projects/${projectId}`);
};

export const removeCollaborator = async (
  projectId: string,
  userId: string
): Promise<unknown> => {
  console.info(`Removing collaborator ${userId} from project ${projectId}`);
  return await apiClient.delete(
    `projects/${projectId}/collaborators/${userId}`
  );
};

// TODO: Add search for users to add as collaborators
export const addCollaborator = async (
  projectId: string,
  userId: string,
  role: "ADMIN" | "MEMBER" | "GUEST"
): Promise<void> => {
  console.info(
    `Adding collaborator ${userId} to project ${projectId} with role ${role}`
  );
  return await apiClient.post<void>(`projects/${projectId}/collaborators`, {
    userId,
    role,
  });
};

export const updateCollaborator = async (
  projectId: string,
  userId: string,
  newRole: "ADMIN" | "MEMBER" | "GUEST"
): Promise<void> => {
  console.info(
    `Updating collaborator ${userId} role to ${newRole} in project ${projectId}`
  );
  return await apiClient.put<void>(
    `projects/${projectId}/collaborators/${userId}`,
    {
      newRole,
    }
  );
};
