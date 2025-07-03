"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleIcon } from '@/components/icons';

export function LoginForm() {
  const router = useRouter();

  const handleLogin = () => {
    // In a real app, this would trigger the OAuth flow.
    // For this pilot, we'll just navigate to the dashboard.
    router.push('/dashboard');
  };

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle>Secure Login</CardTitle>
        <CardDescription>
          Please sign in using your UNOPS Google account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={handleLogin}>
          <GoogleIcon className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
