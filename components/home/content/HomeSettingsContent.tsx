import { Text, View } from "react-native";
import LogoutButton from "@/components/settings/LogoutButton";

export default function HomeSettingsContent() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Settings
      </Text>
      <LogoutButton buttonStyle={{ borderRadius: 12 }} />
    </View>
  );
}
