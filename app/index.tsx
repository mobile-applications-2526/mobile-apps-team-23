import { View } from "react-native";
import Auth from "@/components/Auth";
import { useUnAuth } from "@/hooks/auth/useUnAuth";
import MapScreen from "../components/Map";

export default function Index() {
  useUnAuth();

  return (
    <>
      <View>
        <Auth />
      </View>
      <MapScreen />
    </>
  );
}
