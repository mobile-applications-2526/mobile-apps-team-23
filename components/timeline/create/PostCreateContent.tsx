import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Post, TimelinePost } from "@/types/models";
import PostsService from "@/services/PostsService";
import { mutate } from "swr";
import { Router } from "expo-router";
import PostCreateBottomButtons from "@/components/timeline/create/PostCreateBottomButtons";
import PostCreateSelects from "@/components/timeline/create/PostCreateSelects";
import PostCreateTitleAndContentInputs from "@/components/timeline/create/PostCreateTitleAndContentInputs";
import { HEADER_HEIGHT } from "@/constants/ui";
import ErrorDialog from "@/components/dialogs/ErrorDialog";
import LocationService from "@/services/LocationService";

export default function PostCreateContent({ router }: { router: Router }) {
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(false);
  const [isImageEnabled, setIsImageEnabled] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | undefined>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    LocationService.getLocationPermissionStatus().then((granted) => {
      setIsLocationEnabled(granted);
    });
  }, []);

  const onSwitchLocationToggle = async (value: boolean) => {
    if (value) {
      // Only attempt to enable location if permission is granted
      const granted = await LocationService.getLocationPermissionStatus();
      if (granted) {
        setIsLocationEnabled(true);
      } else {
        setError(
          "Location permission is not granted. Please enable it in your device settings.",
        );
        setIsLocationEnabled(false);
      }
    } else {
      setIsLocationEnabled(false);
    }
  };

  const onSwitchImageToggle = async (value: boolean) => {
    setIsImageEnabled(value);
    if (!value) {
      setImageUrl(undefined);
    }
  };

  const onCreatePost = async () => {
    const trimmedImageUrl = imageUrl?.trim();

    if (isImageEnabled) {
      if (!trimmedImageUrl) {
        console.error("Image URL is required when image is enabled.");
        return;
      }

      try {
        // Validate that the image URL has a proper URL format
        // This will throw if the URL is not syntactically valid
        new URL(trimmedImageUrl);
      } catch (e) {
        console.error("Invalid image URL format:", e);
        return;
      }
    }

    const location: { latitude: number; longitude: number } | null =
      isLocationEnabled ? await LocationService.getClientLocation() : null;

    const post: Post = {
      title,
      description: content,
      image_url: isImageEnabled ? trimmedImageUrl : undefined,
      latitude: isLocationEnabled && location ? location.latitude : undefined,
      longitude: isLocationEnabled && location ? location.longitude : undefined,
    };

    try {
      const createdPost: TimelinePost = await PostsService.createPost(post);
      await PostsService.likePost(createdPost.id!);
      // Intentionally auto-like the newly created post on behalf of the author
      // so that it appears with an initial like in the timeline UI.
      await mutate("timelinePosts");
      router.back();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while creating the post.",
      );
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
      <PostCreateSelects
        isImageEnabled={isImageEnabled}
        onSwitchImageToggle={onSwitchImageToggle}
        isLocationEnabled={isLocationEnabled}
        onSetLocationToggle={onSwitchLocationToggle}
        setImageUrl={setImageUrl}
        textInputStyle={styles.baseInput}
      />
      <PostCreateBottomButtons router={router} onCreatePost={onCreatePost} />
      {error && (
        <ErrorDialog
          errorMessage={error}
          open={true}
          onClose={() => setError(null)}
        />
      )}
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
