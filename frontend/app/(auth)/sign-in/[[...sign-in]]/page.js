import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col flex-1 min-h-[50vh] items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Log into ShopSmart</h1>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
