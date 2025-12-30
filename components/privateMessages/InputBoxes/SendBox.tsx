import { useState } from "react";
import PrivateMessageService from "@/services/PrivateMessageService";
import BaseBox from "@/components/privateMessages/InputBoxes/BaseBox";

export default function SendBox({
  friendId,
}: {
  friendId: string | undefined;
}) {
  const [content, setContent] = useState("");

  const onButtonPress = () => {
    if (!friendId) return;
    if (!content.trim()) return;

    PrivateMessageService.sendPrivateMessage(friendId, content.trim())
      .then(() => {
        setContent("");
      })
      .catch((err) => {
        console.error("Failed to send message:", err);
      });
  };

  return (
    <BaseBox
      onButtonPress={onButtonPress}
      iconName="send"
      content={content}
      setContent={setContent}
      placeholder="Type a message to send..."
    />
  );
}
