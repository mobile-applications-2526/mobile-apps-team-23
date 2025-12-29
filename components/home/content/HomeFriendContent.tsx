import { ScrollView, View } from "react-native";
import FriendList from "@/components/friends/FriendList";
import FriendRequestList from "@/components/friends/FriendRequestList";
import AddFriendButton from "@/components/friends/AddFriendButton";
import { Router } from "expo-router";

export default function HomeFriendContent({ router }: { router: Router }) {
  return (
    <ScrollView>
      <FriendList router={router} />
      <FriendRequestList style={{ marginTop: 12 }} />
      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <View style={{ flex: 1 }}>
          <AddFriendButton buttonStyle={{ borderRadius: 12 }} />
        </View>
      </View>
    </ScrollView>
  );
}
