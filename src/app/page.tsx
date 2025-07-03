import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center text-center">
          <Logo className="mb-4 h-16 w-16 text-primary" />
          <h1 className="font-headline text-3xl font-bold text-primary">
            AFR EU Funds Navigator
          </h1>
          <p className="mt-2 text-muted-foreground">
            UNOPS Africa Region Funding Pilot Database
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
