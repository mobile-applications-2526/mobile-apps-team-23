import { expect } from "@jest/globals";
import { Post, TimelinePost, Userinfo } from "@/types/models";
import { supabase } from "@/utils/supabase";
import PostsService from "@/services/PostsService";

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

describe("Posts Service", () => {
  test("getPosts should return a list of posts", async () => {
    const johnDoe: Userinfo = {
      id: "ID_01",
      name: "John Doe",
    };
    const post: Post = {
      id: 1,
      created_at: "2020-01-01T00:00:00.000Z",
      creator_id: johnDoe.id,
      title: "First Post",
      description: "This is the first post",
      longitude: 0,
      latitude: 0,
    };
    const posts: TimelinePost[] = [
      {
        ...post,
        like_count: 2,
        is_liked_by_user: true,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: posts,
        error: null,
      }),
    });

    const result = await PostsService.getPosts();

    expect(result).toEqual(posts);
  });

  test("likePost should like a post", async () => {
    const johnDoe: Userinfo = {
      id: "ID_01",
      name: "John Doe",
    };
    const post: Post = {
      id: 1,
      created_at: "2020-01-01T00:00:00.000Z",
      creator_id: johnDoe.id,
      title: "First Post",
      description: "This is the first post",
      longitude: 0,
      latitude: 0,
    };

    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
    });

    await PostsService.likePost(post.id as number);

    expect(supabase.from).toHaveBeenCalledWith("postlikes");
  });
});
