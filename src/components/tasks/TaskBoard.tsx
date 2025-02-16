"use client";

import { useState } from "react";
import { type Task } from "~/types";
import { buttonVariants } from "~/styles/components";
import { TaskDialog } from "./TaskDialog";
import { TaskColumn } from "./TaskColumn";
import { api } from "~/utils/api";
import { auth } from "~/server/auth";
import { toast } from "sonner";

export function TaskBoard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const utils = api.useUtils();

  const { data: tasks = [] } = api.task.getAll.useQuery();
  
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      setIsDialogOpen(false);
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    }
  });

  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      setIsDialogOpen(false);
      setSelectedTask(null);
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    }
  });

  const handleAddTask = (task: Partial<Task>) => {
    createTask.mutate(task);
  };

  const handleUpdateTask = (task: Partial<Task>) => {
    updateTask.mutate(task);
  };

  const handleOpenCreateDialog = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleUpdateTaskId = (taskId: string, updates: Partial<Task>) => {
    updateTask.mutate({ id: taskId, updates });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={handleOpenCreateDialog}
          className={buttonVariants["primary"]}
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TaskColumn
          title="To Do"
          tasks={tasks.filter((task: Task) => task.status === "todo")}
          onUpdateTask={handleUpdateTaskId}
          onEditTask={(task) => handleOpenEditDialog(task)}
        />
        <TaskColumn
          title="In Progress"
          tasks={tasks.filter((task: Task) => task.status === "in-progress")}
          onUpdateTask={handleUpdateTaskId}
          onEditTask={(task) => handleOpenEditDialog(task)}
        />
        <TaskColumn
          title="Done"
          tasks={tasks.filter((task: Task) => task.status === "done")}
          onUpdateTask={handleUpdateTaskId}
          onEditTask={(task) => handleOpenEditDialog(task)}
        />
      </div>

      <TaskDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={selectedTask ? handleUpdateTask : handleAddTask}
        task={selectedTask}
      />
    </div>
  );
}
