import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Don't do anything while loading
    if (!session) router.push('/signin'); // Redirect if not authenticated
  }, [session, status, router]);

  return { session, status };
};

export default useAuth;
