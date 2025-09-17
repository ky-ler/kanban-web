import { queryOptions } from "@tanstack/react-query";
import { fetchProjects } from "./projects";

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => fetchProjects(),
});
