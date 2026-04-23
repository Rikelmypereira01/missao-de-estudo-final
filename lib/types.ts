export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "student" | "admin";
          is_blocked: boolean;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price_brl: number;
          is_active: boolean;
          cover_url: string | null;
          whatsapp_group_url: string | null;
          created_at: string;
        };
      };
      contents: {
        Row: {
          id: string;
          product_id: string;
          title: string;
          slug: string;
          description: string | null;
          content_type: "html_local" | "external_link";
          local_path: string | null;
          external_url: string | null;
          is_active: boolean;
          position: number;
          created_at: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          status: "pending" | "paid" | "blocked" | "cancelled";
          amount_brl: number;
          provider: "mercado_pago";
          provider_payment_id: string | null;
          pix_qr_code: string | null;
          pix_qr_code_base64: string | null;
          created_at: string;
          paid_at: string | null;
        };
      };
      sales_logs: {
        Row: {
          id: string;
          action: string;
          actor_user_id: string | null;
          target_user_id: string | null;
          purchase_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
      };
    };
  };
};
