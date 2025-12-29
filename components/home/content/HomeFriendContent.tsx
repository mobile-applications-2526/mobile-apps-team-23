import { ScrollView, View } from "react-native";
import FriendList from "@/components/friends/FriendList";
import FriendRequestList from "@/components/friends/FriendRequestList";
import AddFriendButton from "@/components/friends/AddFriendButton";
import LogoutButton from "@/components/LogoutButton";

export default function HomeFriendContent({ router }: { router: any }) {
  return (
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
  );
}
