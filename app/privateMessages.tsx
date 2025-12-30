import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";
import PrivateMessageList from "@/components/privateMessages/PrivateMessageList";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import SendBox from "@/components/privateMessages/InputBoxes/SendBox";
import EditBox from "@/components/privateMessages/InputBoxes/EditBox";
import { PrivateMessage, Userinfo } from "@/types/models";
import UserService from "@/services/UserService";
import { HEADER_HEIGHT } from "@/constants/ui";
import FriendService from "@/services/FriendService";
import PrivateMessageService, {
  ConversationSummary,
} from "@/services/PrivateMessageService";
import { Icon } from "@rneui/themed";

export default function PrivateMessages() {
  const searchParams = useLocalSearchParams();
  const friendId = (searchParams?.friendId as string | undefined) ?? undefined;
  const router = useRouter();
  const [editingMessage, setEditingMessage] = useState<PrivateMessage | null>(
    null
  );
  const [ownUser, setOwnUser] = useState<Userinfo | null>(null);
  const [friend, setFriend] = useState<Userinfo | null>(null);
  const [conversations, setConversations] = useState<
    { friend: Userinfo; lastMessage: PrivateMessage }[]
  >([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [isSelectingFriend, setIsSelectingFriend] = useState(false);
  const [friends, setFriends] = useState<Userinfo[]>([]);
  const [friendSearch, setFriendSearch] = useState("");

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
          "Unable to load your user information. Some features may not work correctly."
        );
      });
  }, []);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoadingConversations(true);
        const summaries: ConversationSummary[] =
          await PrivateMessageService.getConversationSummaries();
        if (!summaries || summaries.length === 0) {
          setConversations([]);
          return;
        }

        const friendIds = summaries.map((s) => s.friendId);
        const users = await UserService.getUsersByIds(friendIds);
        const usersById = new Map((users ?? []).map((u) => [u.id, u]));

        const merged = summaries
          .map((s) => {
            const friendUser = usersById.get(s.friendId);
            if (!friendUser) return null;
            return { friend: friendUser, lastMessage: s.lastMessage };
          })
          .filter(Boolean) as {
          friend: Userinfo;
          lastMessage: PrivateMessage;
        }[];

        setConversations(merged);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
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

  useEffect(() => {
    if (!isSelectingFriend) return;

    const loadFriends = async () => {
      try {
        const data = await FriendService.getMyFriends();
        setFriends(data ?? []);
      } catch (error) {
        console.error("Failed to load friends:", error);
      }
    };

    loadFriends();
  }, [isSelectingFriend]);

  const openChatWithFriend = (targetFriendId: string) => {
    router.push({
      pathname: "/privateMessages",
      params: { friendId: targetFriendId },
    });
    setIsSelectingFriend(false);
  };

  const filteredFriends = friends.filter((f) =>
    (f.name || "").toLowerCase().includes(friendSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // iOS needs "padding", Android usually works automatically or with "height"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // Offset adjusted for navigation header and status bar
        keyboardVerticalOffset={Platform.OS === "ios" ? HEADER_HEIGHT : 0}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 20,
            paddingHorizontal: 22,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            Private Messages
          </Text>
          <TouchableOpacity onPress={() => setIsSelectingFriend(true)}>
            <Icon name="edit" type="font-awesome" color="#000" size={28} />
          </TouchableOpacity>
        </View>

        {!friendId ? (
          <>
            {loadingConversations ? (
              <Text style={{ textAlign: "center", marginTop: 24 }}>
                Loading conversations...
              </Text>
            ) : conversations.length === 0 ? (
              <Text
                style={{
                  fontSize: 18,
                  marginTop: 32,
                  textAlign: "center",
                  paddingHorizontal: 24,
                }}
              >
                You have no conversations yet. Tap the edit icon in the top
                right to start a new chat with a friend.
              </Text>
            ) : (
              <FlatList
                data={conversations}
                keyExtractor={(item) => item.friend.id ?? ""}
                contentContainerStyle={{
                  paddingHorizontal: 22,
                  paddingBottom: 20,
                }}
                renderItem={({ item }) => {
                  const isOwnSender =
                    item.lastMessage.sender_id === ownUser?.id;
                  const previewPrefix = isOwnSender ? "You: " : "";
                  const previewText = `${previewPrefix}${
                    item.lastMessage.content || ""
                  }`;

                  return (
                    <TouchableOpacity
                      onPress={() =>
                        openChatWithFriend(item.friend.id as string)
                      }
                      style={{
                        paddingVertical: 18,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ddd",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          marginBottom: 6,
                        }}
                      >
                        {item.friend.name || "Unknown friend"}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ color: "#555", fontSize: 18 }}
                      >
                        {previewText}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </>
        ) : (
          <>
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
          </>
        )}

        {isSelectingFriend && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "95%",
                maxHeight: "80%",
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                  }}
                >
                  Start new chat
                </Text>
                <TouchableOpacity onPress={() => setIsSelectingFriend(false)}>
                  <Icon
                    name="close"
                    type="font-awesome"
                    color="#000"
                    size={18}
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Search friends by name..."
                value={friendSearch}
                onChangeText={setFriendSearch}
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  marginBottom: 14,
                  fontSize: 18,
                }}
              />

              <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.id ?? ""}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => openChatWithFriend(item.id as string)}
                    style={{
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ textAlign: "center", marginTop: 8 }}>
                    No friends found.
                  </Text>
                }
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
