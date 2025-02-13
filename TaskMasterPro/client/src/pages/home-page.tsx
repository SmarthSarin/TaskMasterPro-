import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Plus, LogOut } from "lucide-react";
import TaskCard from "@/components/task-card";
import TaskForm from "@/components/task-form";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Sort tasks by ID to maintain stable order
  const sortedTasks = [...tasks].sort((a, b) => b.id - a.id);

  const createTaskMutation = useMutation({
    mutationFn: async (task: Omit<Task, "id" | "userId">) => {
      const res = await apiRequest("POST", "/api/tasks", task);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsCreating(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      ...task
    }: Partial<Task> & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, task);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.username}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {isCreating && (
          <TaskForm
            onSubmit={(data) => createTaskMutation.mutate(data)}
            onCancel={() => setIsCreating(false)}
            isLoading={createTaskMutation.isPending}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={(updates) =>
                updateTaskMutation.mutate({ id: task.id, ...updates })
              }
              onDelete={() => deleteTaskMutation.mutate(task.id)}
              isLoading={
                updateTaskMutation.isPending || deleteTaskMutation.isPending
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}