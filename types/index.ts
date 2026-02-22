export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  google_maps_url: string | null;
  image_url: string | null;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  place_id: string;
  user_id: string;
  score: number;
  review: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaceStats {
  id: string;
  name: string;
  address: string;
  google_maps_url: string | null;
  image_url: string | null;
  description: string | null;
  position: number;
  avg_rating: number | null;
  rating_count: number;
  is_visited: boolean;
}

export interface UserStats {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  avg_score_given: number | null;
  total_ratings: number;
}

export interface RatingWithProfile extends Rating {
  profiles: Pick<Profile, "display_name" | "avatar_url">;
}
