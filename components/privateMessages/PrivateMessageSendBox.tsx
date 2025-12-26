import { View } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useState } from "react";
import PrivateMessageService from "@/services/PrivateMessageService";
import { mutate } from "swr";

export default function PrivateMessageSendBox({
  friendId,
}: {
  friendId: string | undefined;
}) {
  const [content, setContent] = useState("");

  const onMessageSend = () => {
    PrivateMessageService.sendPrivateMessage(friendId!, content)
      .then(() => {
        setContent("");
        mutate("privateMessages_" + friendId);
      })
      .catch((err) => {
        console.error("Failed to send message:", err);
      });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end", // Aligns items to the bottom
        padding: 8,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
      }}
    >
      <Input
        placeholder="Type a message..."
        multiline={true}
        renderErrorMessage={false}
        containerStyle={{ flex: 1, paddingHorizontal: 0 }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          minHeight: 40,
          borderRadius: 20, // Optional: Rounded corners
          paddingHorizontal: 10, // Optional: Text padding inside bubble
          paddingVertical: 5,
        }}
        value={content}
        onChangeText={setContent}
      />

      <Button
        type="clear"
        icon={{
          name: "send",
          type: "font-awesome",
          size: 20,
          color: "#2089dc",
        }}
        containerStyle={{ marginLeft: 8, marginBottom: 4 }}
        onPress={onMessageSend}
      />
    </View>
  );
}
