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
        className="border-muted-foreground/10 border p-2 transition-shadow hover:shadow-lg"
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <CardTitle className="m-0 line-clamp-1 text-base font-medium overflow-ellipsis">
            {issue.title}
          </CardTitle>
        </div>
        <CardFooter className="flex items-center justify-between px-0 pt-0 overflow-ellipsis">
          <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
            {issue.assignedToUsername ? (
              <span
                className={cn(
                  "bg-muted inline-flex items-center gap-1 rounded-full px-1.5 py-0.5",
                )}
              >
                <User className="text-muted-foreground mr-1 h-4 w-4" />
                {issue.assignedToUsername}
              </span>
            ) : (
              <span className={cn("italic")}>Unassigned</span>
            )}
          </div>
          <div className="flex justify-end">
            <span
              className={cn(
                "inline-block rounded px-1.5 py-0.5 text-[10px] font-medium",
                PRIORITIES.indexOf(issue.priority.name) === -1 &&
                  "issue-priority-other",
                PRIORITIES.indexOf(issue.priority.name) === 0 &&
                  "issue-priority-low",
                PRIORITIES.indexOf(issue.priority.name) === 1 &&
                  "issue-priority-medium",
                PRIORITIES.indexOf(issue.priority.name) === 2 &&
                  "issue-priority-high",
                PRIORITIES.indexOf(issue.priority.name) === 3 &&
                  "issue-priority-urgent",
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
