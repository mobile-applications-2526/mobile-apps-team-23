import { expect } from "@jest/globals";
import { supabase } from "@/utils/supabase";
import FriendService from "@/services/FriendService";
import { Friendship, Userinfo } from "@/types/models";

jest.mock("../../utils/supabase", () => ({
  getAuth: jest.fn(() => Promise.resolve({ id: "ID_01", name: "Jane" })),
  supabase: {
    from: jest.fn(),
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

describe("Friend Service", () => {
  test("getMyFriends should return a list of friends", async () => {
    const ownUser: Userinfo = { id: "ID_01", name: "Jane" };
    const friendUser: Userinfo = { id: "ID_02", name: "John" };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [
          {
            accepted: true,
            sender: friendUser,
            receiver: ownUser,
          },
        ],
        error: null,
      }),
    });

    const result = await FriendService.getMyFriends();

    expect(result).toEqual([friendUser]);
  });

  test("getMyFriendRequests should return a list of friend requests", async () => {
    const ownUser: Userinfo = { id: "ID_01", name: "Jane" };
    const requesterUser: Userinfo = { id: "ID_03", name: "Alice" };
    const friendship: (Friendship & { userinfo: Userinfo })[] | null = [
      {
        id: 1,
        user_id: ownUser.id,
        friend_id: requesterUser.id,
        accepted: false,
        userinfo: requesterUser,
      },
    ];

    const mockChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(), // Allows .eq().eq()
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),

      then: jest.fn((onFulfilled) => {
        return Promise.resolve({
          data: friendship,
          error: null,
        }).then(onFulfilled);
      }),
    };
    (supabase.from as jest.Mock).mockReturnValue(mockChain);

    const result = await FriendService.getMyFriendRequests();

    expect(result).toEqual(friendship);
  });

  test("sendFriendRequest should send a friend request successfully", async () => {
    const ownUser = { id: "ID_01", name: "Jane" };
    const targetUser = { id: "ID_03", name: "Alice", user_code: "ALICE123" };

    const userInfoMock = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: targetUser, error: null }),
    };

    const friendshipCheckMock = {
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }), // Important: data: null means no existing request
    };

    const insertMock = {
      insert: jest.fn().mockResolvedValue({ error: null }),
    };

    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === "userinfo") return userInfoMock;
      if (table === "friendship") {
        return { ...friendshipCheckMock, ...insertMock };
      }
    });

    await FriendService.sendFriendRequest(targetUser.user_code);

    expect(insertMock.insert).toHaveBeenCalledWith({
      user_id: ownUser.id,
      friend_id: targetUser.id,
      accepted: false,
    });
  });
});
