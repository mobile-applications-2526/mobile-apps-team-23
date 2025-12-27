export type Userinfo = {
  id?: string;
  user_code?: string;
  created_at?: string;
  name?: string;
  age?: number;
  about?: string;
  description?: string;
};

export type Friendship = {
  id?: number;
  user_id?: string;
  friend_id?: string;
  accepted?: boolean;
};

export type PrivateMessage = {
  id?: number;
  created_at?: string;
  sender_id?: string;
  receiver_id?: string;
  content?: string;
  edited?: boolean;
};

export type Post = {
  id?: number;
  created_at?: string;
  creator_id?: string;
  title?: string;
  description?: string;
  location?: string;
  image_url?: string;
};

export type TimelinePost = Post & {
  creator?: Userinfo;
  like_count?: number;
  is_liked_by_user?: boolean;
};
