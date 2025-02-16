import { redirect } from "next/navigation";
import { SignInButton } from "~/components/auth/SignInButton";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Project Management <span className="text-[hsl(280,100%,70%)]">App</span>
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl text-white">
            Please sign in to continue
          </p>
          <SignInButton isSignedIn={false} />
        </div>
      </div>
    </main>
  );
}
