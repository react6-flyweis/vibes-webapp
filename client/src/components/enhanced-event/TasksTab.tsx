import React from "react";
import { useEventTasks } from "@/queries/tasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateTaskForm from "./CreateTaskForm";
import { Checkbox } from "@/components/ui/checkbox";

export default function TasksTab({ eventId }: any) {
  const { data: tasks, isLoading } = useEventTasks(eventId);

  // const handleToggleTask = (taskId: number, completed: boolean) => {
  //   updateTaskMutation.mutate({ taskId, completed: !completed });
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Tasks</CardTitle>
        <CardDescription>Manage and track event planning tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreateTaskForm eventId={eventId} />

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading tasks...</div>
        ) : tasks?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks yet. Add your first task to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {tasks?.map((task) => (
              <div
                key={task.event_tasks_id}
                className="flex items-center justify-between p-4 border rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                  // checked={task.completed}
                  // onCheckedChange={() =>
                  //   handleToggleTask(task.id, task.completed)
                  // }
                  />
                  <div>
                    <h4
                      className="font-medium"
                      // className={`font-medium ${
                      //   task.completed ? "line-through text-gray-500" : ""
                      // }`}
                    >
                      {task.taskTitle}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {task.createdAt &&
                    new Date(task.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
