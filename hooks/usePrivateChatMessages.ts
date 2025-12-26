import { useEffect, useState } from "react";
import { PrivateMessage } from "@/types/models";
import PrivateMessageService from "@/services/PrivateMessageService";
import { supabase } from "@/utils/supabase";

export function useChatMessages(friendId: string, currentUserId: string) {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);

  useEffect(() => {
    if (!friendId) return;
    if (!currentUserId) return;

    const fetchHistory = async () => {
      try {
        const data = await PrivateMessageService.getPrivateMessages(friendId);
        if (data) setMessages(data as PrivateMessage[]);
      } catch (error) {
        console.error("Failed to fetch private messages:", error);
      }
    };

    fetchHistory();

    const checkValidity = (message: PrivateMessage) => {
      return (
        (message.sender_id === currentUserId &&
          message.receiver_id === friendId) ||
        (message.sender_id === friendId &&
          message.receiver_id === currentUserId)
      );
    };

    const channelName = `private-messages-${currentUserId}_${friendId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "privatemessage" },
        (payload) => {
          const newMessage = payload.new as PrivateMessage;

          if (checkValidity(newMessage)) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "privatemessage" },
        (payload) => {
          const updatedMessage = payload.new as PrivateMessage;

          if (checkValidity(updatedMessage)) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id
                  ? (payload.new as PrivateMessage)
                  : msg,
              ),
            );
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "privatemessage" },
        (payload) => {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== payload.old.id),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [friendId, currentUserId]);

  return { messages };
}
