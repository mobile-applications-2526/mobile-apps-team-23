import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import Auth from "@/components/Auth";
import MapScreen from "../components/Map";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false); // New state
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true); // Now we know the truth
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (initialized && session) {
      router.replace("/home");
    }
  }, [session, initialized, router]);

  if (!initialized) return null;

  return (
    <>
      <View>
        <Auth />
      </View>
      <MapScreen />
    </>
  );
}
