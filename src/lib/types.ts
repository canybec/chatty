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
