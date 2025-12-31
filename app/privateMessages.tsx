import { useAuth } from "@/hooks/auth/useAuth";
import PrivateMessagesScreen from "@/components/privateMessages/PrivateMessagesScreen";
import { View } from "react-native";

export default function PrivateMessages() {
  const { initialized } = useAuth();

  if (!initialized) return null;

  return (
    <View style={{ flex: 1 }} testID="screen-messages">
      <PrivateMessagesScreen />
    </View>
  );
}
