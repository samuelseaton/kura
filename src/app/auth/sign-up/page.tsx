import { AuthView } from '@neondatabase/auth-ui';

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <AuthView path="sign-up" />
    </div>
  );
}
