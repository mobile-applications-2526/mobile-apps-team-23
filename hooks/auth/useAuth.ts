import { useSession } from "@/hooks/auth/useSession";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase";
import * as Notifications from "expo-notifications";
import { User } from "@supabase/auth-js";

export function useAuth() {
  const { session, initialized } = useSession();
  const user: User | null = session?.user ?? null;
  const router = useRouter();

  useEffect(() => {
    if (initialized && !session) {
      router.replace("/");
    }
  }, [session, initialized, router]);

  useEffect(() => {
    if (!user?.id) return;

    // Listen for ANY message sent TO the current user
    const channel = supabase
      .channel("global-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "privatemessage",
          filter: `receiver_id=eq.${user.id}`, // Only listen for messages TO me
        },
        async (payload) => {
          const newMessage = payload.new;

          // Trigger the local notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "New Message Received",
              body: newMessage.content,
              data: { friendId: newMessage.sender_id },
            },
            trigger: null,
          });
        },
      )
      .subscribe();

    // Notification click listener
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { friendId } = response.notification.request.content.data;
        if (friendId) {
          router.push({
            pathname: "/privateMessages",
            params: { friendId: friendId as string },
          });
        }
      },
    );

    return () => {
      supabase.removeChannel(channel);
      subscription.remove();
    };
  }, [user?.id, router]);

  return { user, session, initialized };
}
