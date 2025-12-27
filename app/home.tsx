import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const router = useRouter();

  useAuth();

  return (
    <View style={{ padding: 12, height: "100%" }}>
      <ScrollView>
        <HomeContent router={router} />
      </ScrollView>
    </View>
  );
}
