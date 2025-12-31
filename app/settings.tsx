import { Text, View } from "react-native";
import LogoutButton from "@/components/settings/LogoutButton";

export default function Settings() {
  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Account</Text>
      <View style={{ flex: 1, marginTop: 12 }}>
        <LogoutButton buttonStyle={{ borderRadius: 12 }} />
      </View>
    </View>
  );
}
