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
