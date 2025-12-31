import React from "react";
import { Image, View, ImageStyle, StyleProp } from "react-native";

const DynamicImage = ({
  uri,
  style,
}: {
  uri: string;
  style?: StyleProp<ImageStyle>;
}) => {
  return (
    <Image
      source={{ uri }}
      resizeMode="cover"
      style={[
        style,
        {
          width: "100%",
          height: 200,
          borderRadius: 8,
        },
      ]}
    />
  );
};

export default DynamicImage;
