import useSWR, { mutate } from "swr";
import FriendService from "@/services/FriendService";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Button } from "@rneui/themed";
import { Userinfo } from "@/types/models";
import { Router } from "expo-router";

export default function FriendList({
  router,
  style,
}: {
  router: Router;
  style?: StyleProp<ViewStyle>;
}) {
  const { data: friends = [] } = useSWR<Userinfo[]>(
    "myFriends",
    FriendService.getMyFriends,
    { refreshInterval: 10000 },
  );

  const onFriendMessage = (friendId: string) => {
    router.push(`/privateMessages?friendId=${friendId}`);
  };

  const onFriendRemove = async (friendId: string) => {
    try {
      await FriendService.removeFriend(friendId);
      await mutate("myFriends");
    } catch (error) {
      console.error("Error removing friend:", error);
    }
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginRight: 12,
                fontWeight: "bold",
                flex: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {friend.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Button
                containerStyle={{
                  width: 48,
                }}
                buttonStyle={{
                  height: 48,
                  borderRadius: 24,
                  padding: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => onFriendMessage(friend.id!)}
                icon={{
                  type: "font-awesome",
                  name: "comments",
                  color: "#ffffff",
                  size: 16,
                }}
              />
              <Button
                containerStyle={{
                  width: 48,
                  marginLeft: 8,
                }}
                buttonStyle={{
                  height: 48,
                  borderRadius: 24,
                  padding: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#d9534f",
                }}
                onPress={() => onFriendRemove(friend.id!)}
                icon={{
                  type: "font-awesome",
                  name: "user-times",
                  size: 16,
                  color: "#ffffff",
                }}
              />
            </View>
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
