export type userinfo = {
  id?: string;
  user_code?: string;
  created_at?: string;
  name?: string;
  age?: number;
  about?: string;
  description?: string;
};

export type friendship = {
  id?: number;
  user_id: string;
  friend_id: string;
  accepted?: boolean;
};
