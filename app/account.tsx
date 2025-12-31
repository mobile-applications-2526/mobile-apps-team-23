import { ScrollView, View } from "react-native";
import { useAuth } from "@/hooks/auth/useAuth";
import FriendList from "@/components/friends/FriendList";
import FriendRequestList from "@/components/friends/FriendRequestList";
import AddFriendButton from "@/components/friends/AddFriendButton";
import { useRouter } from "expo-router";

export default function AccountScreen() {
  const { initialized } = useAuth();
  const router = useRouter();

  if (!initialized) return null;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <ScrollView>
        <FriendList router={router} />
        <FriendRequestList style={{ marginTop: 12 }} />
        <View style={{ flex: 1, marginTop: 12 }}>
          <AddFriendButton buttonStyle={{ borderRadius: 12 }} />
        </View>
      </ScrollView>
    </View>
  );
}
