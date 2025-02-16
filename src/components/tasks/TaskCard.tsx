"use client";

import { useState } from "react";
import { type Task } from "~/types";
import { TaskDialog } from "./TaskDialog";
import { api } from "~/utils/api";
import { PencilIcon } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onEdit?: () => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export function TaskCard({ task, onUpdate, onEdit }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: taskDetails } = api.task.get.useQuery(
    { id: task.id },
    { 
      enabled: isDialogOpen,
      // Use the cached task data if query hasn't been fetched yet
      placeholderData: task 
    }
  );

  const handleOpenDetails = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleUpdateTask = (updatedTask: Partial<Task>) => {
    onUpdate(updatedTask);
    handleCloseDialog();
  };

  return (
    <>
      <div 
        className="rounded-lg bg-white p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors relative group"
        onClick={handleOpenDetails}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{task.title}</h3>
          <div className="flex items-center space-x-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetails();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-gray-700"
            >
              <PencilIcon size={16} />
            </button>
          </div>
        </div>
        {/* <p className="mb-2 text-sm text-gray-600">{task.description}</p> */}
        {task.dueDate && (
          <div className="mb-2 text-sm text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        <div className="mb-2 text-sm text-gray-500">
            Assigned to: {task.assignedUser?.name || task.assignedTo || "Unassigned"}
          </div>
        
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <select
            value={task.status}
            onChange={(e) => onUpdate({ status: e.target.value as Task["status"] })}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {isDialogOpen && (
        <TaskDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleUpdateTask}
          task={taskDetails}
        />
      )}
    </>
  );
}
