import { supabase } from "@/utils/supabase";
import { PrivateMessage } from "@/types/models";

const getPrivateMessages = async (friendId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data: messages, error } = await supabase
    .from("privatemessage")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`,
    )
    .order("created_at", { ascending: true }); // Oldest messages at top

  if (error) {
    throw new Error(
      `Failed to fetch private messages: ${error.message || JSON.stringify(error)}`,
    );
  }

  return messages;
};

const sendPrivateMessage = async (recipientId: string, content: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

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
    .insert([message]);

  if (error) {
    throw new Error(
      `Failed to send private message: ${error.message || JSON.stringify(error)}`,
    );
  }

  return data;
};

const editPrivateMessage = async (messageId: number, newContent: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  if (!newContent || newContent.trim() === "") {
    throw new Error("Message content cannot be empty");
  }

  const { data, error } = await supabase
    .from("privatemessage")
    .update({ content: newContent })
    .eq("id", messageId);

  if (error) {
    throw new Error(
      `Failed to edit private message: ${error.message || JSON.stringify(error)}`,
    );
  }

  return data;
};

const deletePrivateMessage = async (messageId: number) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("privatemessage")
    .delete()
    .eq("id", messageId);

  if (error) {
    throw new Error(
      `Failed to delete private message: ${error.message || JSON.stringify(error)}`,
    );
  }
};

const PrivateMessageService = {
  getPrivateMessages,
  sendPrivateMessage,
  editPrivateMessage,
  deletePrivateMessage,
};

export default PrivateMessageService;
