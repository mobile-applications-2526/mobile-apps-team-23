import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { PrivateMessage, Userinfo } from "@/types/models";
import { useRef } from "react";
import { useChatMessages } from "@/hooks/privateMessages/usePrivateChatMessages";
import * as Haptics from "expo-haptics";
import PrivateMessageService from "@/services/PrivateMessageService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function PrivateMessageList({
  ownUser,
  friend,
  setEditingMessage,
}: {
  ownUser: Userinfo | null;
  friend: Userinfo | null;
  setEditingMessage: (message: PrivateMessage | null) => void;
}) {
  const flatListRef = useRef<FlatList>(null);

  const { messages: privateMessages } = useChatMessages(
    friend?.id as string,
    ownUser?.id as string,
  );

  // Render a single message item
  const renderItem = ({ item }: { item: PrivateMessage }) => {
    const senderId = (item as any).senderId ?? (item as any).sender_id ?? "";
    const isReceived = senderId === friend?.id;

    const handleLongPress = async () => {
      if (!isReceived) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Alert.alert(
          "Message Options",
          undefined,
          [
            {
              text: "Delete Message",
              style: "destructive",
              onPress: () => {
                PrivateMessageService.deletePrivateMessage(item.id!);
              },
            },
            {
              text: "Edit Message",
              onPress: () => {
                setEditingMessage(item);
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: true },
        );
      }
    };

    return (
      <Pressable
        onLongPress={handleLongPress}
        delayLongPress={300} // Speed up the response for a "haptic" feel
        style={({ pressed }) => [
          styles.messageBubble,
          isReceived ? styles.receivedBubble : styles.sentBubble,
          pressed && { opacity: 0.8 }, // Visual feedback while holding
        ]}
      >
        <Text style={[styles.senderName, { color: "white" }]}>
          {isReceived ? (friend?.name ? friend?.name : "Friend") : "You"}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: (() => {
              const content = item.content ?? "";
              const cleaned = content
                .replace(/\uFE0F/g, "")
                .replace(/\u200D/g, "");
              const isOnlyEmojis =
                cleaned.length > 0 &&
                /^\p{Emoji_Presentation}+$/u.test(cleaned);
              return isOnlyEmojis ? 40 : 16;
            })(),
          }}
        >
          {item.content}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={[
              styles.timestamp,
              {
                color: "rgba(255,255,255,0.75)",
              },
            ]}
          >
            {item.created_at ? dayjs(item.created_at).fromNow() : ""}
          </Text>
          {item.edited && (
            <Text
              style={[
                styles.timestamp,
                {
                  fontStyle: "italic",
                  marginLeft: 4,
                  color: "rgba(255,255,255,0.75)",
                },
              ]}
            >
              (edited)
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={privateMessages}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        // Auto-scroll to bottom when new messages arrive
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        // Dismiss keyboard when dragging the list
        keyboardDismissMode="on-drag"
        // Improve performance for large lists
        windowSize={10}
        initialNumToRender={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 6,
  },
  receivedBubble: { alignSelf: "flex-start", backgroundColor: "#25D366" },
  sentBubble: { alignSelf: "flex-end", backgroundColor: "#0b93f6" },
  senderName: { fontWeight: "bold", marginBottom: 4, fontSize: 14 },
  timestamp: { fontSize: 10, marginTop: 4 },
});
