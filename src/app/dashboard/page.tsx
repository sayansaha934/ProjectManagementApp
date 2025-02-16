import { redirect } from "next/navigation";

import { TaskBoard } from "~/components/tasks/TaskBoard";
import { ProfileMenu } from "~/components/profile/ProfileMenu";
import { auth } from "~/server/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Task Management</h1>
          <ProfileMenu user={session.user} />
        </div>
        <TaskBoard />
      </div>
    </main>
  );
}
