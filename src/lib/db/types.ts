import type { Vector } from "@pinecone-database/pinecone"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
        }
      }
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
      }
      nurse_gpt: {
        Row: {
          content: string | null
          content_tokens: number | null
          embedding: string | null
          file_name: string | null
          id: number
          page_number: string | null
        }
        Insert: {
          content?: string | null
          content_tokens?: number | null
          embedding?: string | null
          file_name?: string | null
          id?: number
          page_number?: string | null
        }
        Update: {
          content?: string | null
          content_tokens?: number | null
          embedding?: string | null
          file_name?: string | null
          id?: number
          page_number?: string | null
        }
      }
      orders: {
        Row: {
          address: string | null
          city: string | null
          client_id: string
          created_at: string | null
          id: string
          name_order: string | null
          price: number | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          name_order?: string | null
          price?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          name_order?: string | null
          price?: number | null
          zip_code?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          query_embedding: string
          match_count: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      nurse_gpt_search: {
        Args: {
          query_embedding: string
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          file_name: string
          page_number: string
          content: string
          content_tokens: number
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
