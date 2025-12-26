import BaseBox from "@/components/privateMessages/InputBoxes/BaseBox";
import { PrivateMessage } from "@/types/models";
import PrivateMessageService from "@/services/PrivateMessageService";
import { useState } from "react";

export default function EditBox({
  editingMessage,
  setEditingMessage,
}: {
  editingMessage: PrivateMessage;
  setEditingMessage: (message: null) => void;
}) {
  const [content, setContent] = useState(editingMessage.content ?? "");

  const onButtonPress = () => {
    if (editingMessage.id) {
      PrivateMessageService.editPrivateMessage(
        editingMessage.id,
        content,
      ).catch((err) => {
        console.error("Failed to edit message:", err);
      });
    }

    setEditingMessage(null);
  };

  return (
    <BaseBox
      onButtonPress={onButtonPress}
      content={content}
      setContent={setContent}
      iconName="edit"
      autoFocus
    />
  );
}
