import type { IssueSummary } from "@/types/Issue";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

function IssueCard({
  issue,
  projectId,
}: Readonly<{
  issue: IssueSummary;
  projectId: string;
}>) {
  return (
    <Card key={issue.id}>
      <CardHeader>
        <CardTitle>{issue.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{issue.status.name}</p>
        <p>{issue.priority.name}</p>
        {issue.assignedToUserId && <p>{issue.assignedToUserId}</p>}
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link
            to={"/projects/$projectId/issue/$issueId"}
            params={{ projectId, issueId: String(issue.id) }}
          >
            View Issue
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
export default IssueCard;
