"use client";

import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "sonner";
import Image from "next/image";
import { type User, type UserPreferences, type UserProfile } from "~/types";
import { buttonVariants, cardVariants, inputVariants, textVariants } from "~/styles/components";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  // Fetch current profile data
  const { data: profile, refetch } = api.profile.get.useQuery();
  
  // Mutation for updating profile
  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      refetch(); // Refresh the profile data
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  // Local state for form inputs
  const [name, setName] = useState(profile?.name || user.name || "");
  const [image, setImage] = useState(profile?.image || user.image || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [role, setRole] = useState(profile?.role || "");
  const [department, setDepartment] = useState(profile?.department || "");
  const [theme, setTheme] = useState(profile?.theme || "system");
  const [emailNotifications, setEmailNotifications] = useState(profile?.emailNotifications || true);
  const [taskReminders, setTaskReminders] = useState(profile?.taskReminders || true);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only send non-empty values
    const updateData: Partial<UserProfile & Pick<User, 'name'>> = {};
    if (name !== profile?.name) updateData.name = name;
    if (image !== profile?.image) updateData.image = image;
    if (bio !== profile?.bio) updateData.bio = bio;
    if (role !== profile?.role) updateData.role = role;
    if (department !== profile?.department) updateData.department = department;
    if (theme !== profile?.theme) updateData.theme = theme;
    if (emailNotifications !== profile?.emailNotifications) updateData.emailNotifications = emailNotifications;
    if (taskReminders !== profile?.taskReminders) updateData.taskReminders = taskReminders;

    updateProfile.mutate(updateData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture Section */}
      <div className={cardVariants.default}>
        <h2 className={textVariants.h2}>Profile Picture</h2>
        <div className="mt-4 flex items-center gap-4">
          {image ? (
            <Image
              src={image}
              alt={name ?? "Profile"}
              width={96}
              height={96}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-600 text-2xl text-white">
              {name?.[0] ?? "U"}
            </div>
          )}
          
        </div>
      </div>

      {/* Personal Information Section */}
      <div className={cardVariants.default}>
        <h2 className={textVariants.h2}>Personal Information</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={textVariants.small}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputVariants.default}
            />
          </div>
          <div>
            <label className={textVariants.small}>
              Email
            </label>
            <input
              type="email"
              value={user.email ?? ""}
              disabled
              className={inputVariants.disabled}
            />
          </div>
          <div>
            <label className={textVariants.small}>
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputVariants.default}
              placeholder="e.g. Project Manager"
            />
          </div>
          <div>
            <label className={textVariants.small}>
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={inputVariants.default}
              placeholder="e.g. Engineering"
            />
          </div>
          <div className="md:col-span-2">
            <label className={textVariants.small}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={inputVariants.default}
              rows={3}
              placeholder="Tell us about yourself"
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className={cardVariants.default}>
        <h2 className={textVariants.h2}>Preferences</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={textVariants.small}>
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as UserProfile["theme"])}
              className={inputVariants.default}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="emailNotifications" className={textVariants.small}>
              Receive email notifications
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="taskReminders"
              checked={taskReminders}
              onChange={(e) => setTaskReminders(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="taskReminders" className={textVariants.small}>
              Enable task reminders
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className={buttonVariants.primary}
        >
          {updateProfile.isPending ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
