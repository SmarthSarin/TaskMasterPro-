import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, InsertTask, Task } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { FormMessage } from "@/components/ui/form";

type TaskFormProps = {
  onSubmit: (data: InsertTask) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Task;
  submitLabel?: string;
};

export default function TaskForm({
  onSubmit,
  onCancel,
  isLoading,
  initialData,
  submitLabel = "Create Task",
}: TaskFormProps) {
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      status: initialData?.status ?? "pending",
    },
  });

  const title = form.watch("title");
  const titleLength = title?.length || 0;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Task" : "New Task"}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-sm text-muted-foreground">({titleLength}/100)</span>
            </Label>
            <Input
              id="title"
              {...form.register("title")}
              disabled={isLoading}
              className={`w-full ${titleLength > 100 ? "border-destructive" : ""}`}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              disabled={isLoading}
              className="min-h-[100px] resize-y"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}