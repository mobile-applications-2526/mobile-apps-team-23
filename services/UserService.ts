import { supabase } from "@/utils/supabase";
import { userinfo } from "@/types/models";

const getOwnUserinfo = async (): Promise<userinfo> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("userinfo")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    const message = `Failed to fetch user info: ${error.message || "Unknown Supabase error"}`;
    throw new Error(message);
  }

  return data;
};

const UserService = {
  getOwnUserinfo,
};

export default UserService;
