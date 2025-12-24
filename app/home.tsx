import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import LogoutButton from "@/components/LogoutButton";
import FriendRequestList from "@/components/friends/FriendRequestList";
import FriendList from "@/components/friends/FriendList";
import AddFriendButton from "@/components/friends/AddFriendButton";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
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
    if (initialized && !session) {
      router.replace("/");
    }
  }, [session, initialized]);

  if (!initialized || !session) return null;

  return (
    <View style={{ padding: 12, height: "100%" }}>
      <ScrollView>
        <FriendList />
        <FriendRequestList style={{ marginTop: 12 }} />
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <AddFriendButton />
          </View>
          <View style={{ flex: 1 }}>
            <LogoutButton />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
