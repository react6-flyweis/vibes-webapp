import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function TasksTab({
  tasks,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  onCreateTask,
  onToggleTask,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Tasks</CardTitle>
        <CardDescription>Manage and track event planning tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-3">Add New Task</h4>
          <div className="space-y-3">
            <Input
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e: any) => setNewTaskTitle(e.target.value)}
            />
            <Textarea
              placeholder="Task description (optional)..."
              value={newTaskDescription}
              onChange={(e: any) => setNewTaskDescription(e.target.value)}
            />
            <Button onClick={onCreateTask} disabled={!newTaskTitle.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No tasks yet. Add your first task to get started!</div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <Checkbox checked={task.completed} onCheckedChange={() => onToggleTask(task.id, task.completed)} />
                  <div>
                    <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
                    {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                  </div>
                </div>
                <div className="text-sm text-gray-500">{task.dueDate && new Date(task.dueDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
