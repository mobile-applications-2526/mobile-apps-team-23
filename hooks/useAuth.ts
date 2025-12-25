import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function useAuth() {
  const { session, initialized } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !session) {
      router.replace("/");
    }
  }, [session, initialized, router]);

  return { session, initialized };
}
