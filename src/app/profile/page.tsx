import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "~/components/profile/ProfileForm";
import { auth } from "~/server/auth";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
              Back to Tasks
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="mt-2 text-gray-300">
            Manage your personal information and preferences
          </p>
        </div>
        <ProfileForm user={session.user} />
      </div>
    </main>
  );
}
