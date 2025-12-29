import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";
import PrivateMessageList from "@/components/privateMessages/PrivateMessageList";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import SendBox from "@/components/privateMessages/InputBoxes/SendBox";
import EditBox from "@/components/privateMessages/InputBoxes/EditBox";
import { PrivateMessage, Userinfo } from "@/types/models";
import UserService from "@/services/UserService";
import { HEADER_HEIGHT } from "@/constants/ui";

export default function PrivateMessages() {
  const searchParams = useLocalSearchParams();
  const friendId = (searchParams?.friendId as string | undefined) ?? undefined;
  const [editingMessage, setEditingMessage] = useState<PrivateMessage | null>(
    null,
  );
  const [ownUser, setOwnUser] = useState<Userinfo | null>(null);
  const [friend, setFriend] = useState<Userinfo | null>(null);

  useAuth();

  useEffect(() => {
    UserService.getOwnUserinfo()
      .then((data) => {
        setOwnUser(data);
      })
      .catch((error) => {
        console.error("Failed to fetch own user info:", error);
        Alert.alert(
          "Error",
          "Unable to load your user information. Some features may not work correctly.",
        );
      });
  }, []);

  useEffect(() => {
    if (friendId) {
      UserService.getUserinfoById(friendId)
        .then(setFriend)
        .catch((error) => {
          console.error("Failed to fetch friend information:", error);
          Alert.alert("Error", "Failed to load friend information.");
        });
    }
  }, [friendId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, padding: 12 }}
        keyboardVerticalOffset={HEADER_HEIGHT}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 12,
            textAlign: "center",
          }}
        >
          Private Messages
        </Text>
        <PrivateMessageList
          ownUser={ownUser}
          friend={friend}
          setEditingMessage={setEditingMessage}
        />
        {!editingMessage?.id && <SendBox friendId={friendId} />}
        {editingMessage?.id && (
          <EditBox
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
