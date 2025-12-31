import React from "react";
import { View, Text } from "react-native";

const MapView = ({ style }: any) => (
  <View
    style={[
      style,
      {
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
      },
    ]}
  >
    <Text style={{ color: "#888" }}>Map view not supported on Web</Text>
  </View>
);

export const Marker = ({ children }: any) => <>{children}</>;
export const Callout = ({ children }: any) => <View>{children}</View>;
export const PROVIDER_GOOGLE = "google";

export default MapView;
