export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignedTo?: {
    id?: string;
    name?: string;
  } | null;
  dueDate?: Date;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio: string;
  role: string;
  department: string;
  timezone: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  taskReminders: boolean;
}

export type UserPreferences = Pick<UserProfile, "theme" | "emailNotifications" | "taskReminders">;
