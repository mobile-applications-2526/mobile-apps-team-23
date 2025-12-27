import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import PrivateMessageList from "@/components/privateMessages/PrivateMessageList";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import SendBox from "@/components/privateMessages/InputBoxes/SendBox";
import EditBox from "@/components/privateMessages/InputBoxes/EditBox";
import { PrivateMessage } from "@/types/models";
import UserService from "@/services/UserService";
import { HEADER_HEIGHT } from "@/constants/ui";

export default function PrivateMessages() {
  const searchParams = useLocalSearchParams();
  const friendId = (searchParams?.friendId as string | undefined) ?? undefined;
  const [editingMessage, setEditingMessage] = useState<PrivateMessage | null>(
    null,
  );
  const [ownUser, setOwnUser] = useState<any>(null);
  const [friend, setFriend] = useState<any>(null);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // iOS needs "padding", Android usually works automatically or with "height"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // Offset adjusted for navigation header and status bar
        keyboardVerticalOffset={Platform.OS === "ios" ? HEADER_HEIGHT : 0}
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
    </SafeAreaView>
  );
}
