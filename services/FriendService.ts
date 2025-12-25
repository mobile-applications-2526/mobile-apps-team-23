import { supabase } from "@/utils/supabase";
import { friendship, userinfo } from "@/types/models";

const getMyFriends = async (): Promise<userinfo[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("friendship")
    .select(
      `
        accepted,
        sender:userinfo!user_id(id, name),
        receiver:userinfo!friend_id(id, name)
      `,
    )
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .eq("accepted", true);

  if (error) {
    throw new Error(
      `Failed to fetch friends: ${error.message || JSON.stringify(error)}`,
    );
  }

  // Check which side the user is on and return the other side as friend
  return data?.map(
    (friendship: {
      accepted: boolean;
      sender: { id: string; name: string } | { id: string; name: string }[];
      receiver: { id: string; name: string } | { id: string; name: string }[];
    }): userinfo => {
      const senderRaw:
        | { id: string; name: string }
        | { id: string; name: string }[] = (friendship as any).sender;
      const receiverRaw:
        | { id: string; name: string }
        | { id: string; name: string }[] = (friendship as any).receiver;

      const sender: userinfo = Array.isArray(senderRaw)
        ? senderRaw[0]
        : senderRaw;
      const receiver: userinfo = Array.isArray(receiverRaw)
        ? receiverRaw[0]
        : receiverRaw;

      return sender?.id === user.id ? receiver : sender;
    },
  );
};

const getMyFriendRequests = async (): Promise<
  (friendship & { userinfo: userinfo })[] | null
> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data } = await supabase
    .from("friendship")
    .select("*, userinfo!user_id(name)")
    .eq("friend_id", (await supabase.auth.getUser()).data.user?.id)
    .eq("accepted", false);

  return data;
};

const sendFriendRequest = async (inputCode: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Check if input code is valid
  if (!inputCode || inputCode.trim().length === 0) {
    throw new Error("Invalid code!");
  }

  // Find user by code
  const { data: targetUser, error: searchError } = await supabase
    .from("userinfo")
    .select("*")
    .eq("user_code", inputCode.trim())
    .single();
  if (searchError || !targetUser) {
    throw new Error("User not found!");
  }

  // Check if trying to add self
  if (targetUser.id === user.id) {
    throw new Error("You cannot add yourself as a friend!");
  }

  // Check if request already exists
  const { data: existingRequest } = await supabase
    .from("friendship")
    .select("*")
    .or(
      `and(user_id.eq.${user.id},friend_id.eq.${targetUser.id}),and(user_id.eq.${targetUser.id},friend_id.eq.${user.id})`,
    )
    .single();
  if (existingRequest) {
    if (existingRequest.accepted) {
      throw new Error("You are already friends!");
    } else {
      throw new Error("Request already sent!");
    }
  }

  // Create friend request
  const { error: inviteError } = await supabase.from("friendship").insert({
    user_id: user.id,
    friend_id: targetUser.id,
    accepted: false,
  });

  if (inviteError) {
    throw new Error(inviteError.message || "Failed to send friend request");
  }
};

const declineRequest = async (requestId: number) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Check if a request with the given ID exists
  const { data: existingRequest } = await supabase
    .from("friendship")
    .select("*")
    .eq("id", requestId)
    .single();
  if (!existingRequest) {
    throw new Error("Request not found");
  }

  // Check if the request is already accepted
  if (existingRequest.accepted) {
    throw new Error("Cannot decline an accepted request");
  }

  // Delete the friend request
  const { error } = await supabase
    .from("friendship")
    .delete()
    .eq("id", requestId);

  if (error) {
    throw new Error("Failed to decline request");
  }
};

const acceptRequest = async (requestId: number) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Check if a request with the given ID exists
  const { data: existingRequest } = await supabase
    .from("friendship")
    .select("*")
    .eq("id", requestId)
    .single();
  if (!existingRequest) {
    throw new Error("Request not found");
  }

  // Check if the request is already accepted
  if (existingRequest.accepted) {
    throw new Error("Request is already accepted");
  }

  // Update the friend request to accepted
  const { error } = await supabase
    .from("friendship")
    .update({ accepted: true })
    .eq("id", requestId);

  if (error) {
    throw new Error("Failed to accept request");
  }
};

const removeFriend = async (friendId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Check if friendship exists
  const { data: existingFriendship } = await supabase
    .from("friendship")
    .select("*")
    .or(
      `and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`,
    )
    .eq("accepted", true)
    .single();
  if (!existingFriendship) {
    throw new Error("Friendship not found");
  }

  // Delete the friendship
  const { error } = await supabase
    .from("friendship")
    .delete()
    .eq("id", existingFriendship.id);

  if (error) {
    throw new Error("Failed to remove friend");
  }
};

const FriendService = {
  getMyFriends,
  getMyFriendRequests,
  sendFriendRequest,
  declineRequest,
  acceptRequest,
  removeFriend,
};

export default FriendService;
