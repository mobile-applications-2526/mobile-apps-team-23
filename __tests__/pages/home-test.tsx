import { render, waitFor } from "@testing-library/react-native";
import Home from "../../app/home";
import { describe, it, expect, beforeEach } from "@jest/globals";
import PostsService from "@/services/PostsService";

// --- MOCKS ---

jest.mock("../../utils/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() =>
        Promise.resolve({ data: { session: null }, error: null }),
      ),
      getUser: jest.fn(() =>
        Promise.resolve({ data: { user: null }, error: null }),
      ),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
    removeChannel: jest.fn(),
  },
}));

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  addPushTokenListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  setNotificationHandler: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("@/services/UserService", () => ({
  getOwnUserinfo: jest.fn(() =>
    Promise.resolve({ id: 1, name: "Test User 1" }),
  ),
}));

jest.mock("@/services/PostsService", () => ({
  getPosts: jest.fn(),
  deletePost: jest.fn(() => Promise.resolve()),
  likePost: jest.fn(() => Promise.resolve()),
  unlikePost: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/components/NativeMap", () => {
  const { View } = require("react-native");
  return (props: any) => <View {...props} testID="mock-map-view" />;
});

jest.mock("@/components/DynamicImage", () => {
  const { View } = require("react-native");
  return (props: any) => <View {...props} testID="mock-dynamic-image" />;
});

import { SWRConfig } from "swr";
const AllTheProviders = ({ children }: { children: any }) => {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  );
};

const customRender = (ui: any, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// --- TESTS ---

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders posts correctly", async () => {
    const mockPosts = [
      {
        id: 1,
        title: "First Test Post",
        description: "This is a description",
        creator: { id: 1, name: "Test User 1" },
        created_at: new Date().toISOString(),
      },
    ];

    (PostsService.getPosts as jest.Mock).mockResolvedValue(mockPosts);

    // Use the customRender with the fresh SWR cache
    const { getByText } = customRender(<Home />);

    // Since SWR is async, we MUST use waitFor
    await waitFor(() => {
      expect(getByText("Timeline")).toBeTruthy();
      expect(getByText("First Test Post")).toBeTruthy();
    });
  });

  it("handles no posts scenario", async () => {
    (PostsService.getPosts as jest.Mock).mockResolvedValue([]);

    const { getByText, queryByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText("Timeline")).toBeTruthy();
      expect(queryByText("First Test Post")).toBeNull();
      expect(queryByText("Second Test Post")).toBeNull();
    });
  });
});
