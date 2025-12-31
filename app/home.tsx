import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";
import HomeContent from "@/components/home/HomeContent";

export default function Home() {
  const router = useRouter();

  useAuth();

  return (
    <View style={{ padding: 12, height: "100%" }} testID="screen-home">
      <HomeContent router={router} />
    </View>
  );
}
