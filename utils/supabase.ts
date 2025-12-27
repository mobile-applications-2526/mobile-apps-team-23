import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://acmctsiuvvhusxkwxfil.supabase.co";
const supabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbWN0c2l1dnZodXN4a3d4ZmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzOTgzNjIsImV4cCI6MjA4MTk3NDM2Mn0.Be9AtWOS69ktfsiCQe8hU_AkEqS57ZYDd0qTBD9keME";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getAuth = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  return user;
};
