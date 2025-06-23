export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string | null
          preferences: UserPreferences
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          preferences?: UserPreferences
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          preferences?: UserPreferences
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    episodeAlerts: boolean
    scheduleUpdates: boolean
    hostAnnouncements: boolean
  }
  display: {
    showCountdown: boolean
    timeFormat: '12h' | '24h'
    timezone: string
  }
  features: {
    testMode: boolean
    advancedStats: boolean
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'] 