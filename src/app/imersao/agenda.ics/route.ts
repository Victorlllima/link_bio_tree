import { EVENTO } from "@/components/imersao/lote";

/* Agenda das duas noites: dois eventos, horário de Brasília, lembrete de 1 h antes. */
export const dynamic = "force-static";

const fmt = (iso: string) => iso.slice(0, 19).replace(/[-:]/g, "");

const evento = (uid: string, inicio: string, fim: string, titulo: string, desc: string) => `BEGIN:VEVENT
UID:${uid}@redpro.com.br
DTSTAMP:20261103T000000Z
DTSTART;TZID=America/Sao_Paulo:${fmt(inicio)}
DTEND;TZID=America/Sao_Paulo:${fmt(fim)}
SUMMARY:${titulo}
DESCRIPTION:${desc}
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:${titulo} começa em 1 hora
END:VALARM
END:VEVENT`;

export function GET() {
    const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//RedPro AI Academy//Imersao//PT-BR",
        "CALSCALE:GREGORIAN",
        "BEGIN:VTIMEZONE",
        "TZID:America/Sao_Paulo",
        "BEGIN:STANDARD",
        "DTSTART:19700101T000000",
        "TZOFFSETFROM:-0300",
        "TZOFFSETTO:-0300",
        "TZNAME:-03",
        "END:STANDARD",
        "END:VTIMEZONE",
        evento("imersao-noite-1", EVENTO.noite1Inicio, EVENTO.noite1Fim, "Imersão Arquiteto de Agentes · Noite 1", "Seu agente nasce e trabalha. Ao vivo, das 19h às 22h (Brasília)."),
        evento("imersao-noite-2", EVENTO.noite2Inicio, EVENTO.noite2Fim, "Imersão Arquiteto de Agentes · Noite 2", "Seu agente 24 horas e o seu time. Ao vivo, das 19h às 22h (Brasília)."),
        "END:VCALENDAR",
    ].join("\r\n");
    return new Response(ics, {
        headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": 'attachment; filename="imersao-agenda.ics"' },
    });
}
