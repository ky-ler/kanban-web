import type { Issue, IssueRequestData } from "@/types/Issue";
import { apiClient } from "../base-api";

export const fetchIssues = async (projectId: string): Promise<Issue[]> => {
  console.info(`Fetching issues for project ${projectId}`);
  return await apiClient.get<Issue[]>(`projects/${projectId}/issues`);
};

export const fetchSingleIssue = async (
  projectId: string,
  issueId: string,
): Promise<Issue | undefined> => {
  console.info(`Fetching issue ${issueId} from project ${projectId}`);
  return await apiClient.get<Issue>(`projects/${projectId}/issues/${issueId}`);
};

export const createIssue = async (
  issueForm: IssueRequestData,
): Promise<Issue | undefined> => {
  console.info(`Creating new issue in project ${issueForm.projectId}`);
  return await apiClient.post<Issue>(
    `projects/${issueForm.projectId}/issues/create`,
    issueForm,
  );
};

export const updateIssue = async (
  issueId: string,
  issueForm: IssueRequestData,
): Promise<Issue | undefined> => {
  console.info(`Updating issue ${issueId} in project ${issueForm.projectId}`);
  return await apiClient.put<Issue>(
    `projects/${issueForm.projectId}/issues/${issueId}`,
    issueForm,
  );
};

export const deleteIssue = async (
  projectId: string,
  issueId: string,
): Promise<void> => {
  console.info(`Deleting issue ${issueId} from project ${projectId}`);
  return await apiClient.delete<void>(
    `projects/${projectId}/issues/${issueId}`,
  );
};
