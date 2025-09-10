"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// import { LoginForm } from '@/components/auth/login-form';
// import { Logo } from '@/components/icons';

// export default function LoginPage() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
//       <div className="flex w-full max-w-md flex-col items-center text-center">
//         <div className="flex items-center gap-3">
//            <Logo className="h-12 w-12 text-primary" />
//            <div>
//             <h1 className="font-headline text-3xl font-bold text-foreground">
//               AFR EU Funds Navigator
//             </h1>
//              <p className="text-muted-foreground">
//               Your gateway to EU funding opportunities in Africa.
//             </p>
//            </div>
//         </div>
//         
//         <LoginForm />
//
//         <p className="mt-10 text-xs text-muted-foreground">
//           This is a pilot application for authorized UNOPS personnel.
//         </p>
//       </div>
//     </main>
//   );
// }

export default function HomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return null;
}
