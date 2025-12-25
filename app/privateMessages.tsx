import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateMessages() {
  const searchParams = useLocalSearchParams();
  const friendId = (searchParams?.friendId as string | undefined) ?? undefined;

  useAuth();

  return (
    <View style={{ padding: 12 }}>
      <Text>Hello, World!</Text>
      {friendId ? <Text>friendId: {friendId}</Text> : null}
    </View>
  );
}
