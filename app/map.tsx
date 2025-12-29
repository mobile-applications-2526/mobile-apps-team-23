import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";
import HomeContent from "@/components/HomeContent";
import MapScreen from "../components/Map";


export default function Map() {
  const router = useRouter();

  useAuth();

  return (
      <MapScreen />
  );
}