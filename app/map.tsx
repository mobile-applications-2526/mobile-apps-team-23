import { View } from "react-native";
import { useAuth } from "@/hooks/auth/useAuth";
import MapScreen from "@/components/MapScreen";

export default function Map() {
  const { initialized } = useAuth();

  if (!initialized) return null;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <MapScreen />
    </View>
  );
}
