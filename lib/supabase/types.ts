export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      places: {
        Row: {
          id: string;
          name: string;
          address: string;
          google_maps_url: string | null;
          image_url: string | null;
          description: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          google_maps_url?: string | null;
          image_url?: string | null;
          description?: string | null;
          position: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          google_maps_url?: string | null;
          image_url?: string | null;
          description?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          place_id: string;
          user_id: string;
          score: number;
          review: string | null;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          place_id: string;
          user_id: string;
          score: number;
          review?: string | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          place_id?: string;
          user_id?: string;
          score?: number;
          review?: string | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      place_stats: {
        Row: {
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
        };
      };
      user_stats: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          avg_score_given: number | null;
          total_ratings: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
