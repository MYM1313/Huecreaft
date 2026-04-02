export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          category?: string
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          message: string
          rating: number
        }
        Insert: {
          id?: string
          name: string
          message: string
          rating: number
        }
        Update: {
          id?: string
          name?: string
          message?: string
          rating?: number
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          address: string
          service: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email: string
          address: string
          service: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          address?: string
          service?: string
          message?: string
          created_at?: string
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
  }
}
