import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

const PLAN_NAMES: Record<string, string> = {
    "https://buy.stripe.com/cNibJ1eAZ1x174M6dhgbm00": "Mentoria em Grupo",
    "https://buy.stripe.com/6oU14n9gFejNfBifNRgbm01": "Mentoria Individual",
    "https://buy.stripe.com/bJe4gz0K93F974MgRVgbm02": "Mentoria Intensiva",
};

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") ?? "";
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
        const amountTotal = session.amount_total ? (session.amount_total / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—";
        const paymentLink = session.payment_link as string ?? "";
        const planName = PLAN_NAMES[paymentLink] ?? "Mentoria RedPro";

        const msg = [
            "💰 *Nova compra confirmada — Mentoria RedPro*",
            "",
            `📦 *Plano:* ${planName}`,
            `💵 *Valor:* ${amountTotal}`,
            "",
            `👤 *Nome:* ${customerName}`,
            `📧 *Email:* ${customerEmail}`,
            "",
            `🔗 *Session:* \`${session.id}\``,
            `📅 *Data:* ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`
        ].join("\n");

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: msg,
                    parse_mode: "Markdown"
                })
            });
        }
    }

    return NextResponse.json({ received: true });
}
