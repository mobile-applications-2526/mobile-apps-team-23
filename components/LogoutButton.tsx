import { StyleProp, ViewStyle } from "react-native";
import { Button } from "@rneui/themed";
import { supabase } from "@/utils/supabase";

export default function LogoutButton({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Button
      style={style}
      title="Sign Out"
      onPress={() => supabase.auth.signOut()}
      color="#d9534f"
    />
  );
}
