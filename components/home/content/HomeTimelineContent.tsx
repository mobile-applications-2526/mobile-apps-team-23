import { SafeAreaView } from "react-native";
import PostsList from "@/components/timeline/PostsList";
import PostCreateButton from "@/components/timeline/PostCreateButton";

export default function HomeTimelineContent({ router }: { router: any }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PostsList />
      <PostCreateButton
        router={router}
        containerStyle={{ marginTop: 12 }}
        buttonStyle={{ borderRadius: 12 }}
      />
    </SafeAreaView>
  );
}
