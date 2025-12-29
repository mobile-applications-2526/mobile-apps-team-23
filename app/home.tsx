import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const router = useRouter();

  useAuth();

  const goToMap = () => {
    router.push("/map");
  };

  return (
    <View style={{ padding: 12, height: "100%" }}>
      <HomeContent router={router} />
      <TouchableOpacity
        onPress={goToMap}
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: "#007AFF",
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Go to Map</Text>
      </TouchableOpacity>
    </View>
  );
}

