import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { View } from "react-native";
import * as Notifications from "expo-notifications";
import { getAuth, supabase } from "@/utils/supabase";
import { User } from "@supabase/auth-js";
import BottomNav from "@/components/navBar/BottomNav";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Show pop-up while app is open
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getAuth()
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

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
  }, [user?.id]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ animation: "fade" }} />
      </View>
      {user && <BottomNav />}
    </View>
  );
}
