import useSWR, { mutate } from "swr";
import FriendService from "@/services/FriendService";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Button } from "@rneui/themed";
import { userinfo } from "@/types/models";

export default function FriendList({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  const { data: friends = [] } = useSWR<userinfo[]>(
    "myFriends",
    FriendService.getMyFriends,
    { refreshInterval: 10000 },
  );

  const onFriendRemove = async (friendId: string) => {
    await FriendService.removeFriend(friendId);
    await mutate("myFriends");
  };

  return (
    <View style={style}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Friends</Text>
      {friends.map((friend) => (
        <View
          key={friend.id}
          style={{
            padding: 12,
            marginVertical: 8,
            backgroundColor: "#fff",
            borderRadius: 8,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 8, fontWeight: "bold" }}>
            {friend.name}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button title="Message" containerStyle={{ minWidth: 90 }} />
            <Button
              title="Remove Friend"
              containerStyle={{ minWidth: 90, marginLeft: 8 }}
              type="outline"
              color="#ff3b30"
              onPress={() => onFriendRemove(friend.id!)}
            />
          </View>
        </View>
      ))}
      {friends.length === 0 && (
        <Text style={{ fontSize: 16, marginTop: 12 }}>
          You have no friends added.
        </Text>
      )}
    </View>
  );
}
