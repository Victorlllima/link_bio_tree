import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") ?? "";
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_IMERSAO ?? process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error("Webhook signature error:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerEmail = session.customer_details?.email ?? "—";
        const customerName = session.customer_details?.name ?? "—";
        const amountTotal = session.amount_total
            ? (session.amount_total / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            : "—";

        const msg = [
            "🔥 *Nova compra — Imersão RedPro 23/05*",
            "",
            `💵 *Valor:* ${amountTotal}`,
            "",
            `👤 *Nome:* ${customerName}`,
            `📧 *Email:* ${customerEmail}`,
            "",
            `🔗 *Session:* \`${session.id}\``,
            `📅 *Data:* ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
        ].join("\n");

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";

        await Promise.allSettled([
            TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID
                ? fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" }),
                })
                : Promise.resolve(),

            fetch(`${process.env.NEXT_PUBLIC_URL ?? "https://redpro.com.br"}/api/meta-capi`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event_name: "Purchase",
                    email: session.customer_details?.email ?? undefined,
                    name: session.customer_details?.name ?? undefined,
                    value: session.amount_total ? session.amount_total / 100 : 44,
                    currency: "BRL",
                    event_id: `stripe-${session.id}`,
                }),
            }),
        ]);
    }

    return NextResponse.json({ received: true });
}
