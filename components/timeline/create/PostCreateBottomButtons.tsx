import { View } from "react-native";
import { Button } from "@rneui/themed";

export default function PostCreateBottomsButtons({
  router,
  onCreatePost,
}: {
  router: any;
  onCreatePost: () => void;
}) {
  return (
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
  );
}
