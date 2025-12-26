import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import PrivateMessageList from "@/components/privateMessages/PrivateMessageList";
import PrivateMessageSendBox from "@/components/privateMessages/PrivateMessageSendBox";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";

export default function PrivateMessages() {
  const searchParams = useLocalSearchParams();
  const friendId = (searchParams?.friendId as string | undefined) ?? undefined;

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
        <PrivateMessageList friendId={friendId} />
        <PrivateMessageSendBox friendId={friendId} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
