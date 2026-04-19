import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col flex-1 min-h-[50vh] items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Register for ShopSmart</h1>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
