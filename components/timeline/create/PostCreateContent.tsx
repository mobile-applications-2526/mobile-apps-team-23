import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useState } from "react";
import { Post, TimeLinePost } from "@/types/models";
import PostsService from "@/services/PostsService";
import { mutate } from "swr";
import { Router } from "expo-router";
import PostCreateBottomButtons from "@/components/timeline/create/PostCreateBottomButtons";
import PostCreateImageSelect from "@/components/timeline/create/PostCreateImageSelect";
import PostCreateTitleAndContentInputs from "@/components/timeline/create/PostCreateTitleAndContentInputs";
import { HEADER_HEIGHT } from "@/constants/ui";

export default function PostCreateContent({ router }: { router: Router }) {
  const [isImageEnabled, setIsImageEnabled] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>("");

  const onSwitchImageToggle = (value: boolean) => {
    setIsImageEnabled(value);
    if (!value) {
      setImageUrl(undefined);
    }
  };

  const onCreatePost = async () => {
    const post: Post = {
      title,
      description: content,
      image_url: isImageEnabled ? imageUrl : undefined,
    };

    try {
      const createdPost: TimeLinePost = await PostsService.createPost(post);
      await PostsService.likePost(createdPost.id!);
      await mutate("timelinePosts");
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, padding: 12 }}
      keyboardVerticalOffset={HEADER_HEIGHT}
    >
      <PostCreateTitleAndContentInputs
        setTitle={setTitle}
        setContent={setContent}
        textInputStyle={styles.baseInput}
      />
      <PostCreateImageSelect
        isImageEnabled={isImageEnabled}
        onSwitchImageToggle={onSwitchImageToggle}
        setImageUrl={setImageUrl}
        textInputStyle={styles.baseInput}
      />
      <PostCreateBottomButtons router={router} onCreatePost={onCreatePost} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  baseInput: {
    paddingHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
