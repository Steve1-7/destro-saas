export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      bans: {
        Row: {
          banned_by: string | null;
          created_at: string;
          details: string | null;
          device_fingerprint: string | null;
          id: string;
          reason: Database["public"]["Enums"]["ban_reason"];
          user_id: string;
        };
        Insert: {
          banned_by?: string | null;
          created_at?: string;
          details?: string | null;
          device_fingerprint?: string | null;
          id?: string;
          reason: Database["public"]["Enums"]["ban_reason"];
          user_id: string;
        };
        Update: {
          banned_by?: string | null;
          created_at?: string;
          details?: string | null;
          device_fingerprint?: string | null;
          id?: string;
          reason?: Database["public"]["Enums"]["ban_reason"];
          user_id?: string;
        };
        Relationships: [];
      };
      circle_members: {
        Row: {
          circle_id: string;
          id: string;
          joined_at: string;
          role: Database["public"]["Enums"]["user_role"];
          status: Database["public"]["Enums"]["member_status"];
          user_id: string;
        };
        Insert: {
          circle_id: string;
          id?: string;
          joined_at?: string;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["member_status"];
          user_id: string;
        };
        Update: {
          circle_id?: string;
          id?: string;
          joined_at?: string;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["member_status"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey";
            columns: ["circle_id"];
            isOneToOne: false;
            referencedRelation: "circles";
            referencedColumns: ["id"];
          },
        ];
      };
      circles: {
        Row: {
          created_at: string;
          destination_label: string | null;
          driver_id: string;
          id: string;
          is_active: boolean;
          name: string;
          neighborhood: string;
          origin_label: string | null;
          route_summary: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          destination_label?: string | null;
          driver_id: string;
          id?: string;
          is_active?: boolean;
          name: string;
          neighborhood: string;
          origin_label?: string | null;
          route_summary?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          destination_label?: string | null;
          driver_id?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          neighborhood?: string;
          origin_label?: string | null;
          route_summary?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      contracts: {
        Row: {
          amount: number;
          cadence: Database["public"]["Enums"]["payment_cadence"];
          circle_id: string;
          created_at: string;
          driver_id: string;
          id: string;
          lien_deposit: number;
          model: Database["public"]["Enums"]["pricing_model"];
          passenger_id: string;
          signed_at: string | null;
          signed_pdf_url: string | null;
          status: Database["public"]["Enums"]["contract_status"];
          updated_at: string;
        };
        Insert: {
          amount: number;
          cadence: Database["public"]["Enums"]["payment_cadence"];
          circle_id: string;
          created_at?: string;
          driver_id: string;
          id?: string;
          lien_deposit?: number;
          model: Database["public"]["Enums"]["pricing_model"];
          passenger_id: string;
          signed_at?: string | null;
          signed_pdf_url?: string | null;
          status?: Database["public"]["Enums"]["contract_status"];
          updated_at?: string;
        };
        Update: {
          amount?: number;
          cadence?: Database["public"]["Enums"]["payment_cadence"];
          circle_id?: string;
          created_at?: string;
          driver_id?: string;
          id?: string;
          lien_deposit?: number;
          model?: Database["public"]["Enums"]["pricing_model"];
          passenger_id?: string;
          signed_at?: string | null;
          signed_pdf_url?: string | null;
          status?: Database["public"]["Enums"]["contract_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contracts_circle_id_fkey";
            columns: ["circle_id"];
            isOneToOne: false;
            referencedRelation: "circles";
            referencedColumns: ["id"];
          },
        ];
      };
      ledger_entries: {
        Row: {
          amount: number;
          circle_id: string;
          created_at: string;
          description: string | null;
          id: string;
          is_settlement: boolean;
          ride_id: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          circle_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_settlement?: boolean;
          ride_id?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          circle_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_settlement?: boolean;
          ride_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ledger_entries_circle_id_fkey";
            columns: ["circle_id"];
            isOneToOne: false;
            referencedRelation: "circles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ledger_entries_ride_id_fkey";
            columns: ["ride_id"];
            isOneToOne: false;
            referencedRelation: "rides";
            referencedColumns: ["id"];
          },
        ];
      };
      panic_alerts: {
        Row: {
          audio_recording_url: string | null;
          circle_id: string | null;
          created_at: string;
          current_lat: number | null;
          current_lng: number | null;
          id: string;
          is_resolved: boolean;
          resolved_at: string | null;
          ride_id: string | null;
          user_id: string;
        };
        Insert: {
          audio_recording_url?: string | null;
          circle_id?: string | null;
          created_at?: string;
          current_lat?: number | null;
          current_lng?: number | null;
          id?: string;
          is_resolved?: boolean;
          resolved_at?: string | null;
          ride_id?: string | null;
          user_id: string;
        };
        Update: {
          audio_recording_url?: string | null;
          circle_id?: string | null;
          created_at?: string;
          current_lat?: number | null;
          current_lng?: number | null;
          id?: string;
          is_resolved?: boolean;
          resolved_at?: string | null;
          ride_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "panic_alerts_circle_id_fkey";
            columns: ["circle_id"];
            isOneToOne: false;
            referencedRelation: "circles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "panic_alerts_ride_id_fkey";
            columns: ["ride_id"];
            isOneToOne: false;
            referencedRelation: "rides";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          device_fingerprint: string | null;
          display_name: string | null;
          id: string;
          id_verified: boolean;
          neighborhood: string | null;
          phone_masked: string | null;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          device_fingerprint?: string | null;
          display_name?: string | null;
          id: string;
          id_verified?: boolean;
          neighborhood?: string | null;
          phone_masked?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          device_fingerprint?: string | null;
          display_name?: string | null;
          id?: string;
          id_verified?: boolean;
          neighborhood?: string | null;
          phone_masked?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      calls: {
        Row: {
          callee_id: string;
          caller_id: string;
          conversation_id: string;
          created_at: string;
          duration_sec: number | null;
          ended_at: string | null;
          id: string;
          started_at: string | null;
          status: Database["public"]["Enums"]["call_status"];
          webrtc_session_id: string | null;
        };
        Insert: {
          callee_id: string;
          caller_id: string;
          conversation_id: string;
          created_at?: string;
          duration_sec?: number | null;
          ended_at?: string | null;
          id?: string;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["call_status"];
          webrtc_session_id?: string | null;
        };
        Update: {
          callee_id?: string;
          caller_id?: string;
          conversation_id?: string;
          created_at?: string;
          duration_sec?: number | null;
          ended_at?: string | null;
          id?: string;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["call_status"];
          webrtc_session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "calls_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          created_at: string;
          id: string;
          participant_a: string;
          participant_b: string;
          ride_id: string | null;
          ride_request_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          participant_a: string;
          participant_b: string;
          ride_id?: string | null;
          ride_request_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          participant_a?: string;
          participant_b?: string;
          ride_id?: string | null;
          ride_request_id?: string | null;
        };
        Relationships: [];
      };
      driver_earnings: {
        Row: {
          amount: number;
          created_at: string;
          driver_id: string;
          id: string;
          net_amount: number;
          period: string;
          platform_fee: number;
          ride_id: string | null;
          ride_request_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          driver_id: string;
          id?: string;
          period: string;
          platform_fee?: number;
          ride_id?: string | null;
          ride_request_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          driver_id?: string;
          id?: string;
          period?: string;
          platform_fee?: number;
          ride_id?: string | null;
          ride_request_id?: string | null;
        };
        Relationships: [];
      };
      driver_profiles: {
        Row: {
          background_check_status: Database["public"]["Enums"]["verification_status"];
          bank_account: string | null;
          created_at: string;
          current_lat: number | null;
          current_lng: number | null;
          id: string;
          is_online: boolean;
          license_document_url: string | null;
          license_expiry: string;
          license_number: string;
          location_updated_at: string | null;
          rating: number;
          total_earnings: number;
          total_trips: number;
          updated_at: string;
          verification_status: Database["public"]["Enums"]["verification_status"];
        };
        Insert: {
          background_check_status?: Database["public"]["Enums"]["verification_status"];
          bank_account?: string | null;
          created_at?: string;
          current_lat?: number | null;
          current_lng?: number | null;
          id: string;
          is_online?: boolean;
          license_document_url?: string | null;
          license_expiry: string;
          license_number: string;
          location_updated_at?: string | null;
          rating?: number;
          total_earnings?: number;
          total_trips?: number;
          updated_at?: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
        };
        Update: {
          background_check_status?: Database["public"]["Enums"]["verification_status"];
          bank_account?: string | null;
          created_at?: string;
          current_lat?: number | null;
          current_lng?: number | null;
          id?: string;
          is_online?: boolean;
          license_document_url?: string | null;
          license_expiry?: string;
          license_number?: string;
          location_updated_at?: string | null;
          rating?: number;
          total_earnings?: number;
          total_trips?: number;
          updated_at?: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
        };
        Relationships: [];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          is_read: boolean;
          sender_id: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          sender_id: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      ride_locations: {
        Row: {
          driver_id: string;
          heading: number | null;
          id: string;
          lat: number;
          lng: number;
          recorded_at: string;
          ride_id: string;
          speed_kmh: number | null;
        };
        Insert: {
          driver_id: string;
          heading?: number | null;
          id?: string;
          lat: number;
          lng: number;
          recorded_at?: string;
          ride_id: string;
          speed_kmh?: number | null;
        };
        Update: {
          driver_id?: string;
          heading?: number | null;
          id?: string;
          lat?: number;
          lng?: number;
          recorded_at?: string;
          ride_id?: string;
          speed_kmh?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "ride_locations_ride_id_fkey";
            columns: ["ride_id"];
            isOneToOne: false;
            referencedRelation: "rides";
            referencedColumns: ["id"];
          },
        ];
      };
      ride_requests: {
        Row: {
          accepted_at: string | null;
          circle_id: string | null;
          created_at: string;
          driver_id: string | null;
          dropoff_address: string | null;
          dropoff_lat: number;
          dropoff_lng: number;
          estimated_duration_min: number | null;
          expired_at: string | null;
          fare: number | null;
          id: string;
          pickup_address: string | null;
          pickup_lat: number;
          pickup_lng: number;
          rider_id: string;
          status: Database["public"]["Enums"]["ride_request_status"];
        };
        Insert: {
          accepted_at?: string | null;
          circle_id?: string | null;
          created_at?: string;
          driver_id?: string | null;
          dropoff_address?: string | null;
          dropoff_lat: number;
          dropoff_lng: number;
          estimated_duration_min?: number | null;
          expired_at?: string | null;
          fare?: number | null;
          id?: string;
          pickup_address?: string | null;
          pickup_lat: number;
          pickup_lng: number;
          rider_id: string;
          status?: Database["public"]["Enums"]["ride_request_status"];
        };
        Update: {
          accepted_at?: string | null;
          circle_id?: string | null;
          created_at?: string;
          driver_id?: string | null;
          dropoff_address?: string | null;
          dropoff_lat?: number;
          dropoff_lng?: number;
          estimated_duration_min?: number | null;
          expired_at?: string | null;
          fare?: number | null;
          id?: string;
          pickup_address?: string | null;
          pickup_lat?: number;
          pickup_lng?: number;
          rider_id?: string;
          status?: Database["public"]["Enums"]["ride_request_status"];
        };
        Relationships: [];
      };
      rides: {
        Row: {
          circle_id: string;
          created_at: string;
          distance_km: number | null;
          driver_id: string;
          end_lat: number | null;
          end_lng: number | null;
          ended_at: string | null;
          geofence_verified: boolean;
          id: string;
          review_locked_at: string | null;
          scheduled_for: string;
          start_lat: number | null;
          start_lng: number | null;
          started_at: string | null;
          status: Database["public"]["Enums"]["ride_status"];
        };
        Insert: {
          circle_id: string;
          created_at?: string;
          distance_km?: number | null;
          driver_id: string;
          end_lat?: number | null;
          end_lng?: number | null;
          ended_at?: string | null;
          geofence_verified?: boolean;
          id?: string;
          review_locked_at?: string | null;
          scheduled_for: string;
          start_lat?: number | null;
          start_lng?: number | null;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["ride_status"];
        };
        Update: {
          circle_id?: string;
          created_at?: string;
          distance_km?: number | null;
          driver_id?: string;
          end_lat?: number | null;
          end_lng?: number | null;
          ended_at?: string | null;
          geofence_verified?: boolean;
          id?: string;
          review_locked_at?: string | null;
          scheduled_for?: string;
          start_lat?: number | null;
          start_lng?: number | null;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["ride_status"];
        };
        Relationships: [
          {
            foreignKeyName: "rides_circle_id_fkey";
            columns: ["circle_id"];
            isOneToOne: false;
            referencedRelation: "circles";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicles: {
        Row: {
          color: string;
          created_at: string;
          driver_id: string;
          id: string;
          insurance_document_url: string | null;
          is_active: boolean;
          license_plate: string;
          make: string;
          model: string;
          registration_document_url: string | null;
          updated_at: string;
          verification_status: Database["public"]["Enums"]["verification_status"];
          vehicle_type: Database["public"]["Enums"]["vehicle_type"];
          year: number;
        };
        Insert: {
          color: string;
          created_at?: string;
          driver_id: string;
          id?: string;
          insurance_document_url?: string | null;
          is_active?: boolean;
          license_plate: string;
          make: string;
          model: string;
          registration_document_url?: string | null;
          updated_at?: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          vehicle_type: Database["public"]["Enums"]["vehicle_type"];
          year: number;
        };
        Update: {
          color?: string;
          created_at?: string;
          driver_id?: string;
          id?: string;
          insurance_document_url?: string | null;
          is_active?: boolean;
          license_plate?: string;
          make?: string;
          model?: string;
          registration_document_url?: string | null;
          updated_at?: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"];
          year?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_circle_driver: {
        Args: { _circle_id: string; _user_id: string };
        Returns: boolean;
      };
      is_circle_member: {
        Args: { _circle_id: string; _user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      ban_reason: "safety_breach" | "contract_default" | "identity_fraud" | "other";
      call_status: "ringing" | "connected" | "ended" | "missed";
      contract_status: "proposed" | "active" | "pending_settlement" | "settled" | "defaulted";
      member_status: "pending" | "active" | "banned" | "left";
      payment_cadence: "monthly" | "weekly" | "on_demand";
      pricing_model: "flat_seat" | "fuel_split" | "per_km";
      ride_request_status: "pending" | "accepted" | "rejected" | "expired";
      ride_status: "scheduled" | "in_progress" | "completed" | "skipped" | "disputed";
      user_role: "driver" | "passenger" | "both";
      vehicle_type: "sedan" | "suv" | "van" | "hatchback" | "motorcycle" | "other";
      verification_status: "pending" | "approved" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      ban_reason: ["safety_breach", "contract_default", "identity_fraud", "other"],
      call_status: ["ringing", "connected", "ended", "missed"],
      contract_status: ["proposed", "active", "pending_settlement", "settled", "defaulted"],
      member_status: ["pending", "active", "banned", "left"],
      payment_cadence: ["monthly", "weekly", "on_demand"],
      pricing_model: ["flat_seat", "fuel_split", "per_km"],
      ride_request_status: ["pending", "accepted", "rejected", "expired"],
      ride_status: ["scheduled", "in_progress", "completed", "skipped", "disputed"],
      user_role: ["driver", "passenger", "both"],
      vehicle_type: ["sedan", "suv", "van", "hatchback", "motorcycle", "other"],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const;
