import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { Router, useRouter } from "expo-router";
import PostCreateContent from "@/components/timeline/create/PostCreateContent";

export default function PostCreate() {
  const router: Router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        <PostCreateContent router={router} />
      </View>
    </TouchableWithoutFeedback>
  );
}
