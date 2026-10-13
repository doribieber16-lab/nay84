export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      blocked_slots: {
        Row: {
          created_at: string
          day: string
          ends: string | null
          id: string
          reason: string | null
          starts: string | null
        }
        Insert: {
          created_at?: string
          day: string
          ends?: string | null
          id?: string
          reason?: string | null
          starts?: string | null
        }
        Update: {
          created_at?: string
          day?: string
          ends?: string | null
          id?: string
          reason?: string | null
          starts?: string | null
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          id: string
          is_demo: boolean
          name: string
          position: number
        }
        Insert: {
          id?: string
          is_demo?: boolean
          name: string
          position?: number
        }
        Update: {
          id?: string
          is_demo?: boolean
          name?: string
          position?: number
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[]
          category_id: string
          description: string | null
          feature_image_url: string | null
          id: string
          image_url: string | null
          is_available: boolean
          is_demo: boolean
          is_special: boolean
          is_spicy: boolean | null
          is_vegetarian: boolean | null
          name: string
          position: number
          price_cents: number | null
        }
        Insert: {
          allergens?: string[]
          category_id: string
          description?: string | null
          feature_image_url?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_demo?: boolean
          is_special?: boolean
          is_spicy?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          position?: number
          price_cents?: number | null
        }
        Update: {
          allergens?: string[]
          category_id?: string
          description?: string | null
          feature_image_url?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_demo?: boolean
          is_special?: boolean
          is_spicy?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          position?: number
          price_cents?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      opening_hours: {
        Row: {
          closes: string
          id: string
          opens: string
          weekday: number
        }
        Insert: {
          closes: string
          id?: string
          opens: string
          weekday: number
        }
        Update: {
          closes?: string
          id?: string
          opens?: string
          weekday?: number
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          day: string
          email: string
          id: string
          name: string
          notes: string | null
          party: number
          phone: string
          privacy_accepted: boolean
          slot: string
          status: Database["public"]["Enums"]["reservation_status"]
        }
        Insert: {
          created_at?: string
          day: string
          email: string
          id?: string
          name: string
          notes?: string | null
          party: number
          phone: string
          privacy_accepted: boolean
          slot: string
          status?: Database["public"]["Enums"]["reservation_status"]
        }
        Update: {
          created_at?: string
          day?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          party?: number
          phone?: string
          privacy_accepted?: boolean
          slot?: string
          status?: Database["public"]["Enums"]["reservation_status"]
        }
        Relationships: []
      }
      restaurant_settings: {
        Row: {
          auto_confirm: boolean
          id: number
          last_seating_before_close_minutes: number
          max_days_ahead: number
          max_party: number
          min_advance_minutes: number
          seating_minutes: number
          slot_minutes: number
          total_seats: number
        }
        Insert: {
          auto_confirm?: boolean
          id?: number
          last_seating_before_close_minutes?: number
          max_days_ahead?: number
          max_party?: number
          min_advance_minutes?: number
          seating_minutes?: number
          slot_minutes?: number
          total_seats?: number
        }
        Update: {
          auto_confirm?: boolean
          id?: number
          last_seating_before_close_minutes?: number
          max_days_ahead?: number
          max_party?: number
          min_advance_minutes?: number
          seating_minutes?: number
          slot_minutes?: number
          total_seats?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_reservation: {
        Args: {
          _day: string
          _email: string
          _name: string
          _notes: string
          _party: number
          _phone: string
          _privacy: boolean
          _slot: string
        }
        Returns: {
          id: string
          status: Database["public"]["Enums"]["reservation_status"]
        }[]
      }
      get_available_slots: {
        Args: { _day: string; _party: number }
        Returns: {
          available: boolean
          slot: string
        }[]
      }
    }
    Enums: {
      reservation_status:
        | "pendente"
        | "confirmada"
        | "cancelada"
        | "concluida"
        | "nao_compareceu"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      reservation_status: [
        "pendente",
        "confirmada",
        "cancelada",
        "concluida",
        "nao_compareceu",
      ],
    },
  },
} as const
