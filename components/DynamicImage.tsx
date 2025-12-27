import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  ActivityIndicator,
  ImageStyle,
  StyleProp,
} from "react-native";

const DynamicImage = ({
  uri,
  style,
}: {
  uri: string;
  style: StyleProp<ImageStyle>;
}) => {
  const [aspectRatio, setAspectRatio] = useState(1); // Default to square while loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uri) return;

    // 1. Get the actual dimensions of the remote image
    Image.getSize(
      uri,
      (width, height) => {
        const realRatio = width / height;

        // 2. Clamp the ratio to ensure it doesn't get too tall.
        // A ratio of 1/3 means the height is 3x the width.
        // We take the MAX because a smaller ratio = taller image.
        const constrainedRatio = Math.max(realRatio, 1 / 3);

        setAspectRatio(constrainedRatio);
        setLoading(false);
      },
      (error) => {
        console.error("Couldn't get image size", error);
        setLoading(false);
      },
    );
  }, [uri]);

  if (loading) {
    // Optional: Render a placeholder or loader with a fixed height
    return (
      <View
        style={[
          style,
          {
            width: "100%",
            height: 200,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
          },
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      // 3. 'cover' ensures that if we clamped the height, the image fills the space nicely (cropping the bottom)
      resizeMode="cover"
      style={[
        style,
        {
          width: "100%",
          aspectRatio: aspectRatio,
          borderRadius: 8,
        },
      ]}
    />
  );
};

export default DynamicImage;
