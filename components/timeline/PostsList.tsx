import { StyleProp, Text, View, ViewStyle } from "react-native";
import useSWR, { mutate } from "swr";
import PostsService from "@/services/PostsService";
import { TimeLinePost } from "@/types/models";
import { Button } from "@rneui/themed";
import DynamicImage from "@/components/DynamicImage";

export default function PostsList({ style }: { style?: StyleProp<ViewStyle> }) {
  const { data: posts = [] } = useSWR<TimeLinePost[]>(
    "timelinePosts",
    PostsService.getPosts,
    { refreshInterval: 15000 },
  );

  const onLikePress = async (post: TimeLinePost) => {
    try {
      // Optimistically update the UI
      await mutate(
        "timelinePosts",
        (currentPosts) => {
          if (!currentPosts) return currentPosts;

          return currentPosts.map((p: TimeLinePost) => {
            if (p.id === post.id) {
              const isLiked = p.is_liked_by_user;
              const currentCount = p.like_count ?? 0;

              return {
                ...p,
                is_liked_by_user: !isLiked,
                like_count: isLiked ? currentCount - 1 : currentCount + 1,
              };
            }
            return p;
          });
        },
        false,
      );

      // Send the like/unlike request
      if (post.is_liked_by_user) {
        await PostsService.unlikePost(post.id!);
      } else {
        await PostsService.likePost(post.id!);
      }
    } catch (err) {
      console.error("Failed to toggle like status:", err);
      return;
    } finally {
      // Revalidate the data
      await mutate("timelinePosts");
    }
  };

  return (
    <View style={style}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Timeline</Text>
      {posts.map((post: TimeLinePost) => (
        <View
          key={post.id}
          style={{
            padding: 12,
            marginVertical: 8,
            backgroundColor: "#fff",
            borderRadius: 8,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              marginBottom: 8,
              fontWeight: "bold",
              fontSize: 16,
              fontStyle: "italic",
            }}
          >
            {post.creator?.name ?? "Unknown User"}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 4,
              color: post.title ? "#000000" : "#888888",
            }}
          >
            {post.title || "(No Title)"}
          </Text>
          <Text>{post.description}</Text>
          {post.image_url ? (
            <View style={{ marginTop: 8 }}>
              <DynamicImage
                uri={post.image_url}
                style={{
                  borderRadius: 8,
                }}
              />
            </View>
          ) : (
            <></>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            {post.created_at ? (
              <Text style={{ fontSize: 12, color: "#888" }}>
                {new Date(post.created_at).toLocaleString()}
              </Text>
            ) : (
              <View />
            )}
            <Button
              type="clear"
              buttonStyle={{ padding: 0 }}
              titleStyle={{ color: "#007bff" }}
              onPress={async () => {
                await onLikePress(post);
              }}
              title={`${post.like_count ?? 0}`}
              icon={{
                name: post.is_liked_by_user ? "thumbs-up" : "thumbs-o-up",
                type: "font-awesome",
                size: 16,
                color: "#007bff",
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
