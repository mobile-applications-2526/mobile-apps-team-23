import React from "react";
import { render } from "@testing-library/react-native";
import MapScreen from "@/components/MapScreen";

jest.mock("react-native-maps", () => {
  const ReactNative = jest.requireActual("react-native");
  const MockMap = (props: any) => <ReactNative.View {...props} />;
  const MockMarker = (props: any) => <ReactNative.View {...props} />;
  const MockCallout = (props: any) => <ReactNative.View {...props} />;

  return {
    __esModule: true,
    default: MockMap,
    Marker: MockMarker,
    Callout: MockCallout,
    PROVIDER_GOOGLE: "google",
  };
});

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 0, longitude: 0 },
  }),
  watchPositionAsync: jest.fn().mockResolvedValue({ remove: jest.fn() }),
  Accuracy: { High: 1 },
}));

jest.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest
        .fn()
        .mockResolvedValue({ data: { session: { user: { id: "1" } } } }),
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: "1" } } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
    removeChannel: jest.fn(),
  },
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

describe("MapScreen", () => {
  it("renders without crashing", () => {
    render(<MapScreen />);
  });
});
