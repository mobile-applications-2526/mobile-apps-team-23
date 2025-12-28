import { useSession } from "@/hooks/auth/useSession";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function useUnAuth() {
  const { session, initialized } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (initialized && session) {
      router.replace("/home");
    }
  }, [session, initialized, router]);

  return { session, initialized };
}
