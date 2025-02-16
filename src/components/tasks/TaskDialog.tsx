"use client";

import { useState, useEffect } from "react";
import { type Task } from "~/types";
import { api } from "~/utils/api";
import { toast } from "sonner";
import {
  buttonVariants,
  inputVariants,
  textVariants,
} from "~/styles/components";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  task?: Task | null; // Optional task for editing
}

export function TaskDialog({ open, onClose, onSubmit, task }: TaskDialogProps) {
  const { data: users } = api.user.getAll.useQuery<User[]>();

  // State for form inputs
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<Task["status"]>(task?.status ?? "todo");
  const [priority, setPriority] = useState<Task["priority"]>(
    task?.priority ?? "medium",
  );
  const [assignedTo, setAssignedTo] = useState(
    task?.assignedUser?.id ?? task?.assignedTo ?? "",
  );
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
  );
  const [tags, setTags] = useState(task?.tags?.join(", ") ?? "");

  // Reset form when task changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setStatus(task?.status ?? "todo");
      setPriority(task?.priority ?? "medium");
      setAssignedTo(task?.assignedUser?.id ?? task?.assignedTo ?? "");
      setDueDate(
        task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      );
      setTags(task?.tags?.join(", ") ?? "");
      console.log("Full task object:", task);
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Prepare task data
    const taskData: Partial<Task> = {
      // Only include fields that have changed from the original task
      ...(title.trim() !== task?.title ? { title: title.trim() || null } : {}),
      ...(description.trim() !== task?.description ? { description: description.trim() || null } : {}),
      ...(status !== task?.status ? { status } : {}),
      ...(priority !== task?.priority ? { priority } : {}),
      ...(assignedTo !== (task?.assignedTo ?? task?.assignedUser?.id) 
        ? { assignedTo: assignedTo === "" ? null : assignedTo } 
        : {}),
      ...(dueDate !== (task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "") 
        ? { dueDate: dueDate ? new Date(dueDate) : null } 
        : {}),
      ...(tags !== (task?.tags?.join(", ") ?? "") 
        ? { 
            tags: tags
              ? tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              : null 
          } 
        : {}),
    };

    // If editing an existing task, include the ID
    if (task) {
      (taskData as { id: string }).id = task.id;
    }

    onSubmit(taskData);
  };

  const handleCancel = () => {
    // Reset form to original values
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "todo");
    setPriority(task?.priority ?? "medium");
    setAssignedTo(task?.assignedUser?.id ?? task?.assignedTo ?? "");
    setDueDate(
      task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    );
    setTags(task?.tags?.join(", ") ?? "");

    // Close dialog
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className={textVariants.h2}>
          {task ? "Edit Task" : "Create New Task"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className={textVariants.small}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputVariants.default}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className={textVariants.small}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputVariants.default}
              placeholder="Optional task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={textVariants.small}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className={inputVariants.default}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className={textVariants.small}>Priority</label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Task["priority"])
                }
                className={inputVariants.default}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className={textVariants.small}>Assigned To</label>
            <select
              value={assignedTo ?? ""}
              onChange={(e) => setAssignedTo(e.target.value || "")}
              className={inputVariants.default}
            >
              <option value="">Unassigned</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={textVariants.small}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputVariants.default}
            />
          </div>

          <div>
            <label className={textVariants.small}>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputVariants.default}
              placeholder="Comma-separated tags"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 w-full">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`${buttonVariants.primary} px-4 py-2`}
            >
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
