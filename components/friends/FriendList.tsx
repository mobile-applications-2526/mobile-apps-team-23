import useSWR, { mutate } from "swr";
import FriendService from "@/services/FriendService";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { Icon } from "@rneui/themed";
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
              <Pressable
                onPress={() => onFriendMessage(friend.id!)}
                style={({ pressed }) => [
                  {
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#6dac60",
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Icon
                  type="font-awesome"
                  name="comments"
                  size={16}
                  color="#ffffff"
                />
              </Pressable>
              <Pressable
                onPress={() => onFriendRemove(friend.id!)}
                style={({ pressed }) => [
                  {
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    marginLeft: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#d9534f",
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Icon
                  type="font-awesome"
                  name="user-times"
                  size={16}
                  color="#ffffff"
                />
              </Pressable>
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
