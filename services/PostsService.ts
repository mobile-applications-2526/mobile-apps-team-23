import { getAuth, supabase } from "@/utils/supabase";
import { Post, TimeLinePost } from "@/types/models";

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

const createPost = async (post: Post) => {
  const user = await getAuth();

  if (!post.title || !post.description) {
    throw new Error("Post title and description are required.");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      creator_id: user.id,
      title: post.title,
      description: post.description,
      location: post.location,
      image_url: post.image_url,
    })
    .select("*, creator:userinfo(id, name), like_count, is_liked_by_user");

  if (error) {
    console.log(error);
    throw new Error(
      `Failed to create post: ${error.message || JSON.stringify(error)}`,
    );
  }

  return data[0] as TimeLinePost;
};

const deletePost = async (postId: number): Promise<void> => {
  await getAuth();

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.log(error);
    throw new Error(
      `Failed to delete post: ${error.message || JSON.stringify(error)}`,
    );
  }
};

const PostsService = {
  getPosts,
  likePost,
  unlikePost,
  createPost,
  deletePost,
};

export default PostsService;
