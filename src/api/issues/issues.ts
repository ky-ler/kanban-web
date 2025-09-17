import type { Issue } from "@/types/Issue";
import { api } from "../api";

export const fetchIssue = async (projectId: string, issueId: string) => {
  console.info(
    "Fetching info about issue: " + issueId + " from project: " + projectId
  );
  const issue = await api
    .get<Issue>(
      `${import.meta.env.VITE_API_URL}/projects/${projectId}/issues/${issueId}`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
    });

  return issue;
};
