import { useEffect, useState } from "react";
import { privateMessage } from "@/types/models";
import PrivateMessageService from "@/services/PrivateMessageService";
import { supabase } from "@/utils/supabase";

export function useChatMessages(friendId: string, currentUserId: string) {
  const [messages, setMessages] = useState<privateMessage[]>([]);

  useEffect(() => {
    if (!friendId) return;
    if (!currentUserId) return;

    const fetchHistory = async () => {
      const data = await PrivateMessageService.getPrivateMessages(friendId);
      if (data) setMessages(data as privateMessage[]);
    };

    fetchHistory();

    const insertChannelName = `private-messages-insert-${currentUserId}_${friendId}`;
    const insertChannel = supabase
      .channel(insertChannelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "privatemessage" },
        (payload) => {
          const newMessage = payload.new as privateMessage;

          if (
            (newMessage.sender_id == currentUserId &&
              newMessage.receiver_id == friendId) ||
            (newMessage.sender_id == friendId &&
              newMessage.receiver_id == currentUserId)
          ) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertChannel);
    };
  }, [friendId, currentUserId]);

  return { messages };
}
