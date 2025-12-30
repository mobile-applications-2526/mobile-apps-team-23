import { SafeAreaView, ScrollView, View } from "react-native";
import { useAuth } from "@/hooks/auth/useAuth";
import FriendList from "@/components/friends/FriendList";
import FriendRequestList from "@/components/friends/FriendRequestList";
import AddFriendButton from "@/components/friends/AddFriendButton";
import LogoutButton from "@/components/settings/LogoutButton";
import { useRouter } from "expo-router";

export default function AccountScreen() {
  const { initialized } = useAuth();
  const router = useRouter();

  if (!initialized) return null;

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <ScrollView>
        <FriendList router={router} />
        <FriendRequestList style={{ marginTop: 12 }} />
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <AddFriendButton buttonStyle={{ borderRadius: 12 }} />
          </View>
          <View style={{ flex: 1 }}>
            <LogoutButton buttonStyle={{ borderRadius: 12 }} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
