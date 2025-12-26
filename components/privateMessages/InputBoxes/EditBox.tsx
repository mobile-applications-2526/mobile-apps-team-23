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
  const originalContent = editingMessage.content ?? "";
  const [content, setContent] = useState(editingMessage.content ?? "");

  const onEditButtonPress = () => {
    if (
      editingMessage.id &&
      content.length > 0 &&
      content !== originalContent
    ) {
      PrivateMessageService.editPrivateMessage(
        editingMessage.id,
        content,
      ).catch((err) => {
        console.error("Failed to edit message:", err);
      });
    }

    setEditingMessage(null);
  };

  const onResetButtonPress = () => {
    setContent(originalContent);
  };

  return (
    <>
      <BaseBox
        onButtonPress={
          content.length > 0 ? onEditButtonPress : onResetButtonPress
        }
        content={content}
        setContent={setContent}
        iconName={
          content === originalContent
            ? "arrow-left"
            : content.length > 0
              ? "edit"
              : "undo"
        }
        autoFocus
        allowEmptyContent={content.length === 0}
        defaultColor={content.length === 0 ? "#f39c12" : undefined}
        placeholder={
          content.length === 0 ? "Reset to original message" : undefined
        }
      />
    </>
  );
}
