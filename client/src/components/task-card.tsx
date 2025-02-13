import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Task } from "@shared/schema";
import { Loader2, MoreVertical, Trash, Edit, CheckCircle2, Circle, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TaskForm from "./task-form";
import { useState } from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

type TaskCardProps = {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  isLoading?: boolean;
};

const statusColors = {
  pending: "bg-yellow-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
};

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
  isLoading,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <TaskForm
        onSubmit={(data) => {
          onUpdate(data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        isLoading={isLoading}
        initialData={task}
        submitLabel="Update Task"
      />
    );
  }

  return (
    <Card className="flex flex-col min-h-[200px] max-h-[300px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="text-lg line-clamp-1 max-w-[calc(100%-3rem)] cursor-default">
                {task.title}
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <p>{task.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={onDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">
          {task.description}
        </p>
      </CardContent>
      <CardFooter className="flex-shrink-0 pt-4">
        <ToggleGroup
          type="single"
          value={task.status}
          onValueChange={(value) => {
            if (value) {
              onUpdate({ status: value });
            }
          }}
          className="justify-start w-full"
          disabled={isLoading}
        >
          <ToggleGroupItem 
            value="completed"
            className="flex-1 flex gap-2 items-center justify-center data-[state=on]:bg-green-100"
          >
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="in-progress"
            className="flex-1 flex gap-2 items-center justify-center data-[state=on]:bg-blue-100"
          >
            <Timer className="h-4 w-4" />
            In Progress
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="pending"
            className="flex-1 flex gap-2 items-center justify-center data-[state=on]:bg-yellow-100"
          >
            <Circle className="h-4 w-4" />
            Pending
          </ToggleGroupItem>
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
}