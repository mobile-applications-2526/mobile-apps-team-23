import { View } from "react-native";
import Auth from "@/components/Auth";
import { useUnAuth } from "@/hooks/auth/useUnAuth";

export default function Index() {
  useUnAuth();

  return (
    <>
      <View>
        <Auth />
      </View>
    </>
  );
}
