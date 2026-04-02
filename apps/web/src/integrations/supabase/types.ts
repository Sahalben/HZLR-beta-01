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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          accepted_at: string | null
          cancelled_at: string | null
          created_at: string
          id: string
          job_id: string
          queue_position: number | null
          status: Database["public"]["Enums"]["application_status"]
          type: Database["public"]["Enums"]["application_type"]
          updated_at: string
          worker_id: string
        }
        Insert: {
          accepted_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          id?: string
          job_id: string
          queue_position?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          type?: Database["public"]["Enums"]["application_type"]
          updated_at?: string
          worker_id: string
        }
        Update: {
          accepted_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          id?: string
          job_id?: string
          queue_position?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          type?: Database["public"]["Enums"]["application_type"]
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_holds: {
        Row: {
          amount_cents: number
          created_at: string
          employer_wallet_id: string
          id: string
          job_id: string
          released_at: string | null
          status: Database["public"]["Enums"]["escrow_status"]
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          employer_wallet_id: string
          id?: string
          job_id: string
          released_at?: string | null
          status?: Database["public"]["Enums"]["escrow_status"]
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          employer_wallet_id?: string
          id?: string
          job_id?: string
          released_at?: string | null
          status?: Database["public"]["Enums"]["escrow_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrow_holds_employer_wallet_id_fkey"
            columns: ["employer_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_holds_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["job_category"]
          created_at: string
          description: string | null
          employer_id: string
          ends_at: string | null
          guaranteed_hours: number
          id: string
          location_lat: number | null
          location_lng: number | null
          pay_per_hour: number
          prefunded: boolean
          qty_filled: number
          qty_needed: number
          starts_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          total_pay: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: Database["public"]["Enums"]["job_category"]
          created_at?: string
          description?: string | null
          employer_id: string
          ends_at?: string | null
          guaranteed_hours?: number
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          pay_per_hour?: number
          prefunded?: boolean
          qty_filled?: number
          qty_needed?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          total_pay?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["job_category"]
          created_at?: string
          description?: string | null
          employer_id?: string
          ends_at?: string | null
          guaranteed_hours?: number
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          pay_per_hour?: number
          prefunded?: boolean
          qty_filled?: number
          qty_needed?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          total_pay?: number
          updated_at?: string
        }
        Relationships: []
      }
      kyc_records: {
        Row: {
          attempts: number
          consent_given: boolean
          consent_timestamp: string | null
          created_at: string
          id: string
          provider: string
          reference: string
          status: Database["public"]["Enums"]["kyc_status"]
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          consent_given?: boolean
          consent_timestamp?: string | null
          created_at?: string
          id?: string
          provider: string
          reference: string
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          consent_given?: boolean
          consent_timestamp?: string | null
          created_at?: string
          id?: string
          provider?: string
          reference?: string
          status?: Database["public"]["Enums"]["kyc_status"]
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_email: string | null
          company_address: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          hiring_role: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          onboarding_state: Database["public"]["Enums"]["onboarding_state"]
          phone: string | null
          photo_url: string | null
          preferred_categories: string[] | null
          radius_km: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_email?: string | null
          company_address?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          hiring_role?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          onboarding_state?: Database["public"]["Enums"]["onboarding_state"]
          phone?: string | null
          photo_url?: string | null
          preferred_categories?: string[] | null
          radius_km?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_email?: string | null
          company_address?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          hiring_role?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          onboarding_state?: Database["public"]["Enums"]["onboarding_state"]
          phone?: string | null
          photo_url?: string | null
          preferred_categories?: string[] | null
          radius_km?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_cents: number
          created_at: string
          description: string | null
          fee_cents: number
          id: string
          job_id: string | null
          reference_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          description?: string | null
          fee_cents?: number
          id?: string
          job_id?: string | null
          reference_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          description?: string | null
          fee_cents?: number
          id?: string
          job_id?: string | null
          reference_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          available_cents: number
          created_at: string
          currency: string
          id: string
          pending_cents: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_cents?: number
          created_at?: string
          currency?: string
          id?: string
          pending_cents?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_cents?: number
          created_at?: string
          currency?: string
          id?: string
          pending_cents?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "cancelled"
        | "completed"
      application_type: "applied" | "queued"
      escrow_status: "held" | "released" | "refunded"
      job_category:
        | "construction"
        | "cleaning"
        | "delivery"
        | "warehouse"
        | "hospitality"
        | "retail"
        | "security"
        | "driving"
        | "other"
      job_status:
        | "draft"
        | "open"
        | "filled"
        | "in_progress"
        | "completed"
        | "cancelled"
      kyc_status: "pending" | "verified" | "failed"
      onboarding_state:
        | "ANONYMOUS"
        | "ROLE_SELECTED"
        | "OTP_REQUESTED"
        | "OTP_VERIFIED"
        | "PROFILE_DATA_COLLECTED"
        | "E_KYC_PENDING"
        | "E_KYC_VERIFIED"
        | "ONBOARDING_COMPLETE"
      transaction_type:
        | "credit"
        | "debit"
        | "escrow_hold"
        | "escrow_release"
        | "withdrawal"
        | "refund"
      user_role: "worker" | "employer"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      application_status: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ],
      application_type: ["applied", "queued"],
      escrow_status: ["held", "released", "refunded"],
      job_category: [
        "construction",
        "cleaning",
        "delivery",
        "warehouse",
        "hospitality",
        "retail",
        "security",
        "driving",
        "other",
      ],
      job_status: [
        "draft",
        "open",
        "filled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      kyc_status: ["pending", "verified", "failed"],
      onboarding_state: [
        "ANONYMOUS",
        "ROLE_SELECTED",
        "OTP_REQUESTED",
        "OTP_VERIFIED",
        "PROFILE_DATA_COLLECTED",
        "E_KYC_PENDING",
        "E_KYC_VERIFIED",
        "ONBOARDING_COMPLETE",
      ],
      transaction_type: [
        "credit",
        "debit",
        "escrow_hold",
        "escrow_release",
        "withdrawal",
        "refund",
      ],
      user_role: ["worker", "employer"],
    },
  },
} as const
