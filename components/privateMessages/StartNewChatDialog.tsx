import { useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BaseDialog from "@/components/dialogs/BaseDialog";
import type { Userinfo } from "@/types/models";

type StartNewChatDialogProps = {
  open: boolean;
  onClose: () => void;
  friends: Userinfo[];
  onSelectFriend: (friendId: string) => void;
};

export default function StartNewChatDialog({
  open,
  onClose,
  friends,
  onSelectFriend,
}: StartNewChatDialogProps) {
  const [search, setSearch] = useState("");

  const filteredFriends = useMemo(
    () =>
      friends.filter((f) =>
        (f.name || "").toLowerCase().includes(search.toLowerCase()),
      ),
    [friends, search],
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      closeOnBackdropPress
      customDialogStyle={{ maxHeight: "80%" }}
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
      </View>

      <TextInput
        placeholder="Search friends by name..."
        value={search}
        onChangeText={setSearch}
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
            onPress={() => onSelectFriend(item.id as string)}
            style={{
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
            testID={`friend-item-${item.name}`}
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
    </BaseDialog>
  );
}
