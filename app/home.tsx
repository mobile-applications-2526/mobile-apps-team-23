import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import LogoutButton from "@/components/LogoutButton";
import FriendRequestList from "@/components/friends/FriendRequestList";
import FriendList from "@/components/friends/FriendList";
import AddFriendButton from "@/components/friends/AddFriendButton";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();

  useAuth();

  return (
    <View style={{ padding: 12, height: "100%" }}>
      <ScrollView>
        <FriendList router={router} />
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
