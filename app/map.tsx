import { SafeAreaView } from "react-native";
import { useAuth } from "@/hooks/auth/useAuth";
import MapScreen from "@/components/MapScreen";

export default function Map() {
  const { initialized } = useAuth();

  if (!initialized) return null;

  return (
    <SafeAreaView style={{ flex: 1 }} testID="screen-map">
      <MapScreen />
    </SafeAreaView>
  );
}
