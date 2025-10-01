import type { IssueSummary } from "@/types/Issue";
import { PRIORITIES } from "@/types/Issue";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { User } from "lucide-react";
import { Link } from "@tanstack/react-router";

function IssueCard({
  issue,
  projectId,
}: Readonly<{
  issue: IssueSummary;
  projectId: string;
}>) {
  return (
    <Link
      to={"/projects/$projectId/issue/$issueId"}
      params={{ projectId, issueId: String(issue.id) }}
      className="block"
    >
      <Card
        key={issue.id}
        className="transition-shadow hover:shadow-lg border border-muted-foreground/10 p-2"
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <CardTitle className="line-clamp-1 text-base font-medium m-0 overflow-ellipsis">
            {issue.title}
          </CardTitle>
        </div>
        <CardFooter className="pt-0 px-0 flex items-center justify-between overflow-ellipsis">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            {issue.assignedToUsername ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded-full"
                )}
              >
                <User className="w-4 h-4 mr-1 text-muted-foreground" />
                {issue.assignedToUsername}
              </span>
            ) : (
              <span className={cn("italic")}>Unassigned</span>
            )}
          </div>
          <div className="flex justify-end">
            <span
              className={cn(
                "inline-block px-1.5 py-0.5 rounded text-[10px] font-medium",
                PRIORITIES.indexOf(issue.priority.name) === -1 &&
                  "issue-priority-other",
                PRIORITIES.indexOf(issue.priority.name) === 0 &&
                  "issue-priority-low",
                PRIORITIES.indexOf(issue.priority.name) === 1 &&
                  "issue-priority-medium",
                PRIORITIES.indexOf(issue.priority.name) === 2 &&
                  "issue-priority-high",
                PRIORITIES.indexOf(issue.priority.name) === 3 &&
                  "issue-priority-urgent"
              )}
            >
              {issue.priority.name}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
export default IssueCard;
