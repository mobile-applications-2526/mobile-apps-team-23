import { Button } from "@rneui/themed";
import { StyleProp, ViewStyle } from "react-native";
import { Router } from "expo-router";

export default function PostCreateButton({
  router,
  containerStyle,
  buttonStyle,
}: {
  router: Router;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <Button
      title="Create Post"
      icon={{ name: "plus", type: "font-awesome", color: "#ffffff" }}
      onPress={() => {
        router.push("/postCreate");
      }}
      containerStyle={containerStyle}
      buttonStyle={buttonStyle}
    />
  );
}
