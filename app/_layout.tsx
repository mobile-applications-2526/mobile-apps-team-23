import { Stack } from "expo-router";
import { View } from "react-native";
import * as Notifications from "expo-notifications";
import BottomNav from "@/components/navBar/BottomNav";
import { useAuth } from "@/hooks/auth/useAuth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Show pop-up while app is open
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const { user } = useAuth();

  return (
    <>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ animation: "fade" }} />
      </View>
      {user && <BottomNav />}
    </>
  );
}
