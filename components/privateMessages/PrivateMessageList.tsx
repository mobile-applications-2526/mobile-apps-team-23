import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { privateMessage, userinfo } from "@/types/models";
import { useEffect, useState, useRef } from "react";
import UserService from "@/services/UserService";
import { useChatMessages } from "@/hooks/usePrivateChatMessages";
import * as Haptics from "expo-haptics";
import PrivateMessageService from "@/services/PrivateMessageService";

export default function PrivateMessageList({
  friendId,
}: {
  friendId: string | undefined;
}) {
  const [ownUserinfo, setOwnUserinfo] = useState<userinfo | null>(null);
  const [friend, setFriend] = useState<userinfo | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    UserService.getOwnUserinfo().then((data) => {
      setOwnUserinfo(data);
    });
  }, []);

  const { messages: privateMessages } = useChatMessages(
    friendId as string,
    ownUserinfo?.id as string,
  );

  useEffect(() => {
    if (friendId) {
      UserService.getUserinfoById(friendId).then(setFriend);
    }
  }, [friendId]);

  // Render a single message item
  const renderItem = ({ item }: { item: privateMessage }) => {
    const senderId = (item as any).senderId ?? (item as any).sender_id ?? "";
    const isReceived = senderId === friendId;

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
        <Text
          style={[styles.senderName, { color: isReceived ? "#000" : "#fff" }]}
        >
          {isReceived ? (friend?.name ? friend?.name : "Friend") : "You"}
        </Text>
        <Text
          style={{
            color: isReceived ? "#000" : "#fff",
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
              { color: isReceived ? "#888" : "rgba(255,255,255,0.8)" },
            ]}
          >
            {new Date(item.created_at!).toLocaleString()}
          </Text>
          {item.edited && (
            <Text
              style={[
                styles.timestamp,
                {
                  fontStyle: "italic",
                  marginLeft: 4,
                  color: isReceived ? "#888" : "rgba(255,255,255,0.8)",
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
    <View style={styles.container}>
      <Text style={styles.header}>
        Private Messages{friend?.name && ` with ${friend.name}`}
      </Text>

      <FlatList
        ref={flatListRef}
        data={privateMessages}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        // Auto-scroll to bottom when new messages arrive
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        // Dismiss keyboard when dragging the list
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12 }, // Flex 1 ensures it takes available space
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 6,
    maxWidth: "80%", // Don't let bubbles go full width
  },
  receivedBubble: { alignSelf: "flex-start", backgroundColor: "#ffffff" },
  sentBubble: { alignSelf: "flex-end", backgroundColor: "#0b93f6" },
  senderName: { fontWeight: "bold", marginBottom: 4, fontSize: 14 },
  timestamp: { fontSize: 10, marginTop: 4 },
});
