import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui";
import { APP_NAME, WHATSAPP_GROUP_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30 py-8">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-black text-white">{APP_NAME}</div>
            <div className="text-sm text-zinc-400">Conteúdo protegido, acesso vitalício e gestão total pelo admin.</div>
          </div>
          <Link
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white hover:bg-white/10"
          >
            <MessageCircle size={18} /> Entrar no grupo do WhatsApp
          </Link>
        </div>
      </Container>
    </footer>
  );
}
