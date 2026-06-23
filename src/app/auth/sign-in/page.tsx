import { AuthView } from "@neondatabase/auth-ui";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <AuthView path="sign-in" />
    </div>
  );
}
