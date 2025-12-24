import FriendService from "@/services/FriendService";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Button } from "@rneui/themed";
import useSWR from "swr";
import { mutate } from "swr";
import { friendship, userinfo } from "@/types/models";

export default function FriendRequestList({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  const { data: requests = [] } = useSWR<
    (friendship & { userinfo: userinfo })[]
  >(
    "myFriendRequests",
    async () => {
      const res = await FriendService.getMyInvitations();
      return res ?? [];
    },
    { refreshInterval: 10000 },
  );

  const acceptRequest = async (friendId: number) => {
    try {
      await FriendService.acceptRequest(friendId);
      await mutate("myFriendRequests");
      await mutate("myFriends");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineRequest = async (friendId: number) => {
    try {
      await FriendService.declineRequest(friendId);
      await mutate("myFriendRequests");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <View style={style}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Friend Requests</Text>
      {requests.map((request) => (
        <View
          key={request.id}
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
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            {request.userinfo.name} has sent you a friend request!
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button
              title="Accept"
              onPress={() => acceptRequest(request.id!)}
              containerStyle={{ minWidth: 90 }}
            />
            <Button
              title="Decline"
              onPress={() => declineRequest(request.id!)}
              containerStyle={{ minWidth: 90, marginLeft: 8 }}
              type="outline"
            />
          </View>
        </View>
      ))}
      {requests.length === 0 && (
        <Text style={{ fontSize: 16, marginTop: 12 }}>
          No pending friend requests.
        </Text>
      )}
    </View>
  );
}
