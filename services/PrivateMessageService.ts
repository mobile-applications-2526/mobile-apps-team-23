import { getAuth, supabase } from "@/utils/supabase";
import { PrivateMessage } from "@/types/models";

export type ConversationSummary = {
  friendId: string;
  lastMessage: PrivateMessage;
};

const getPrivateMessages = async (friendId: string) => {
  const user = await getAuth();

  const { data: messages, error } = await supabase
    .from("privatemessage")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`,
    )
    .order("created_at", { ascending: true }); // Oldest messages at top

  if (error) {
    throw new Error(
      `Failed to fetch private messages: ${
        error.message || JSON.stringify(error)
      }`,
    );
  }

  return messages;
};

const sendPrivateMessage = async (recipientId: string, content: string) => {
  const user = await getAuth();

  if (!content || content.trim() === "") {
    throw new Error("Message content cannot be empty");
  }

  const message: PrivateMessage = {
    sender_id: user.id,
    receiver_id: recipientId,
    content,
  };

  const { data, error } = await supabase
    .from("privatemessage")
    .insert([message])
    .select();

  if (error) {
    throw new Error(
      `Failed to send private message: ${
        error.message || JSON.stringify(error)
      }`,
    );
  }

  return data;
};

const getConversationSummaries = async (): Promise<ConversationSummary[]> => {
  const user = await getAuth();

  const { data: messages, error } = await supabase
    .from("privatemessage")
    .select("*")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch conversation summaries: ${
        error.message || JSON.stringify(error)
      }`,
    );
  }

  const latestByFriend: Record<string, PrivateMessage> = {};

  (messages as PrivateMessage[] | null)?.forEach((message) => {
    const otherUserId =
      message.sender_id === user.id ? message.receiver_id : message.sender_id;
    if (!otherUserId) return;

    if (!latestByFriend[otherUserId]) {
      latestByFriend[otherUserId] = message;
    }
  });

  return Object.entries(latestByFriend).map(([friendId, lastMessage]) => ({
    friendId,
    lastMessage,
  }));
};

const editPrivateMessage = async (messageId: number, newContent: string) => {
  await getAuth();

  if (!newContent || newContent.trim() === "") {
    throw new Error("Message content cannot be empty");
  }

  const { data, error } = await supabase
    .from("privatemessage")
    .update({ content: newContent })
    .eq("id", messageId);

  if (error) {
    throw new Error(
      `Failed to edit private message: ${
        error.message || JSON.stringify(error)
      }`,
    );
  }

  return data;
};

const deletePrivateMessage = async (messageId: number) => {
  await getAuth();

  const { error } = await supabase
    .from("privatemessage")
    .delete()
    .eq("id", messageId);

  if (error) {
    throw new Error(
      `Failed to delete private message: ${
        error.message || JSON.stringify(error)
      }`,
    );
  }
};

const PrivateMessageService = {
  getPrivateMessages,
  getConversationSummaries,
  sendPrivateMessage,
  editPrivateMessage,
  deletePrivateMessage,
};

export default PrivateMessageService;
