import { getAuth, supabase } from "@/utils/supabase";
import { Userinfo } from "@/types/models";

const getOwnUserinfo = async (): Promise<Userinfo> => {
  const user = await getAuth();

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

const updateOwnUserinfo = async (userinfo: Userinfo): Promise<Userinfo> => {
  const user = await getAuth();

  const { data, error } = await supabase
    .from("userinfo")
    .update(userinfo)
    .eq("id", user.id)
    .single();

  if (error) {
    const message = `Failed to update user info: ${error.message || "Unknown Supabase error"}`;
    throw new Error(message);
  }

  return data;
};

const getUserinfoById = async (userId: string): Promise<Userinfo> => {
  await getAuth();

  const { data, error } = await supabase
    .from("userinfo")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    const message = `Failed to fetch user info by ID: ${error.message || "Unknown Supabase error"}`;
    throw new Error(message);
  }

  return data;
};

const UserService = {
  getOwnUserinfo,
  updateOwnUserinfo,
  getUserinfoById,
};

export default UserService;
