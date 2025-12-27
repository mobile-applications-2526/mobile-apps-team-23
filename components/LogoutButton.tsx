import { StyleProp, ViewStyle } from "react-native";
import { Button } from "@rneui/themed";
import { supabase } from "@/utils/supabase";

export default function LogoutButton({
  containerStyle,
  buttonStyle,
}: {
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <Button
      containerStyle={containerStyle}
      buttonStyle={buttonStyle}
      title="Sign Out"
      onPress={() => supabase.auth.signOut()}
      color="#d9534f"
      icon={{
        name: "sign-out",
        type: "font-awesome",
        color: "#ffffff",
      }}
    />
  );
}
