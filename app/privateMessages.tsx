import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import PrivateMessageList from "@/components/privateMessages/PrivateMessageList";
import { KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { useState } from "react";
import SendBox from "@/components/privateMessages/InputBoxes/SendBox";
import EditBox from "@/components/privateMessages/InputBoxes/EditBox";
import { PrivateMessage } from "@/types/models";

export default function PrivateMessages() {
  const searchParams = useLocalSearchParams();
  const friendId = (searchParams?.friendId as string | undefined) ?? undefined;
  const [editingMessage, setEditingMessage] = useState<PrivateMessage | null>(
    null,
  );

  useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // iOS needs "padding", Android usually works automatically or with "height"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // Offset might be needed if you have a header (approx 60-100)
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <PrivateMessageList
          friendId={friendId}
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
