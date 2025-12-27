import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  Switch,
} from "react-native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import { Router, useRouter } from "expo-router";
import PostsService from "@/services/PostsService";
import { Post, TimeLinePost } from "@/types/models";
import { mutate } from "swr";

export default function PostCreate() {
  const HEADER_HEIGHT = 90; // Adjust this value based on your header height
  const router: Router = useRouter();

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, padding: 12 }}
          keyboardVerticalOffset={HEADER_HEIGHT}
        >
          <View style={{ flex: 1, marginBottom: 12 }}>
            <TextInput
              placeholder="Title"
              placeholderTextColor="#888"
              style={[styles.baseInput, { marginBottom: 12 }]}
              onChangeText={(title) => setTitle(title)}
            />

            <TextInput
              placeholder="What's on your mind?"
              placeholderTextColor="#888"
              multiline
              scrollEnabled
              style={[
                styles.baseInput,
                {
                  minHeight: 100,
                  flex: 1,
                  textAlignVertical: "top",
                },
              ]}
              onChangeText={(content) => setContent(content)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              height: 40,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginRight: 8,
                alignSelf: "center",
              }}
            >
              Image?
            </Text>
            <Switch
              value={isImageEnabled}
              onValueChange={onSwitchImageToggle}
              style={{ alignSelf: "center" }}
            />
            {isImageEnabled && (
              <TextInput
                placeholder="Image URL"
                placeholderTextColor="#888"
                style={[
                  styles.baseInput,
                  {
                    marginLeft: 12,
                    flex: 1,
                    alignSelf: "center",
                  },
                ]}
                onChangeText={(imageUrl) => setImageUrl(imageUrl)}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Button
              title="Cancel"
              containerStyle={{ flex: 1, marginRight: 8 }}
              buttonStyle={{
                backgroundColor: "#00000000",
                borderColor: "#d9534f",
                borderWidth: 1,
                borderRadius: 12,
              }}
              titleStyle={{
                color: "#d9534f",
              }}
              onPress={() => router.back()}
              icon={{
                name: "times",
                type: "font-awesome",
                color: "#d9534f",
                size: 18,
              }}
            />
            <Button
              title="Create Post"
              containerStyle={{ flex: 1 }}
              buttonStyle={{ backgroundColor: "#4CAF50", borderRadius: 12 }}
              icon={{
                name: "plus",
                type: "font-awesome",
                color: "white",
                size: 18,
              }}
              onPress={onCreatePost}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  baseInput: {
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
