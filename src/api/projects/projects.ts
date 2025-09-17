import type { Project } from "@/types/Project";
import { api } from "../api";

export const fetchProjects = async () => {
  console.info("Fetching projects...");
  const projects = await api
    .get<Project[]>(`${import.meta.env.VITE_API_URL}/projects`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
    });
  return projects;
};

export const fetchProject = async (projectId: string) => {
  console.info("Fetching info about project: " + projectId);
  const project = await api
    .get<Project>(`${import.meta.env.VITE_API_URL}/projects/${projectId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
    });

  return project;
};
