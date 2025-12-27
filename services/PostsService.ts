import { getAuth, supabase } from "@/utils/supabase";
import { TimeLinePost } from "@/types/models";

const getPosts = async (): Promise<TimeLinePost[]> => {
  await getAuth();

  const { data, error } = await supabase
    .from("posts")
    .select("*, creator:userinfo(id, name), like_count, is_liked_by_user")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    throw new Error(
      `Failed to fetch posts: ${error.message || JSON.stringify(error)}`,
    );
  }

  return data as TimeLinePost[];
};

const likePost = async (postId: number): Promise<void> => {
  const user = await getAuth();

  const { error } = await supabase.from("postlikes").insert([
    {
      post_id: postId,
      liker_id: user.id,
    },
  ]);

  if (error) {
    console.log(error);
    throw new Error(
      `Failed to like post: ${error.message || JSON.stringify(error)}`,
    );
  }

  return;
};

const unlikePost = async (postId: number): Promise<void> => {
  const user = await getAuth();

  const { error } = await supabase
    .from("postlikes")
    .delete()
    .eq("post_id", postId)
    .eq("liker_id", user.id);

  if (error) {
    console.log(error);
    throw new Error(
      `Failed to unlike post: ${error.message || JSON.stringify(error)}`,
    );
  }

  return;
};

const PostsService = {
  getPosts,
  likePost,
  unlikePost,
};

export default PostsService;
