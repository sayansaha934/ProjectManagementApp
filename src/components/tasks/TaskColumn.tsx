"use client";

import { type Task } from "~/types";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
}

export function TaskColumn({ 
  title, 
  tasks, 
  onUpdateTask,
  onEditTask 
}: TaskColumnProps) {
  const handleUpdateTask = (task: Task, updates: Partial<Task>) => {
    onUpdateTask(task.id, updates);
  };

  return (
    <div className="rounded-lg bg-gray-100 p-4">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={(updates) => handleUpdateTask(task, updates)}
            onEdit={() => onEditTask(task)}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks</p>
        )}
      </div>
    </div>
  );
}
