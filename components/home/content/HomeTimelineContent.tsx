import { View } from "react-native";
import PostsList from "@/components/timeline/PostsList";
import PostCreateButton from "@/components/timeline/PostCreateButton";
import type { Router } from "expo-router";

export default function HomeTimelineContent({ router }: { router: Router }) {
  return (
    <View style={{ flex: 1 }}>
      <PostsList />
      <PostCreateButton
        router={router}
        containerStyle={{ marginTop: 12 }}
        buttonStyle={{ borderRadius: 12 }}
      />
    </View>
  );
}
